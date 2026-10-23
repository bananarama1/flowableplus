package com.flowableplus.work.modeler;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.AtomicMoveNotSupportedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.nio.file.StandardOpenOption;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Stream;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilderFactory;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.w3c.dom.Document;
import org.xml.sax.ErrorHandler;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException;

public class ModelerFileService {

	private final Path root;
	private final List<String> extensions;
	private final long debounceMillis;
	private final AtomicLong revision = new AtomicLong();
	private WatchService watchService;
	private Thread watcherThread;

	public ModelerFileService(FlowablePlusModelerProperties properties) {
		this.root = properties.getRoot().toAbsolutePath().normalize();
		this.extensions = properties.getExtensions().stream()
				.map(extension -> extension.toLowerCase().startsWith(".") ? extension.toLowerCase() : "." + extension.toLowerCase())
				.toList();
		this.debounceMillis = Math.max(0, properties.getWatchDebounceMillis());
	}

	@PostConstruct
	void start() throws IOException {
		Files.createDirectories(root);
		watchService = root.getFileSystem().newWatchService();
		registerDirectories();
		watcherThread = new Thread(this::watch, "flowableplus-modeler-files");
		watcherThread.setDaemon(true);
		watcherThread.start();
	}

	@PreDestroy
	void stop() throws IOException {
		if (watcherThread != null) {
			watcherThread.interrupt();
		}
		if (watchService != null) {
			watchService.close();
		}
	}

	public List<ModelerFile> list() throws IOException {
		try (Stream<Path> paths = Files.walk(root)) {
			return paths.filter(Files::isRegularFile)
					.filter(this::isSupported)
					.map(path -> new ModelerFile(toKey(path), lastModified(path), revision.get()))
					.sorted(Comparator.comparing(ModelerFile::key))
					.toList();
		}
	}

	public ModelerFileContent read(String key) throws IOException {
		Path path = resolve(key);
		if (!Files.isRegularFile(path) || !isSupported(path)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Model file not found");
		}
		return new ModelerFileContent(toKey(path), Files.readString(path), lastModified(path), revision.get(), isBpmn(path));
	}

	public ModelerFileContent write(String key, String xml) throws IOException {
		Path path = resolve(key);
		if (!isSupported(path)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported model file extension");
		}
		validateXml(xml);
		Files.createDirectories(path.getParent());
		Path temporary = Files.createTempFile(path.getParent(), path.getFileName().toString(), ".tmp");
		try {
			Files.writeString(temporary, xml, StandardCharsets.UTF_8, StandardOpenOption.TRUNCATE_EXISTING);
			try {
				Files.move(temporary, path, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING);
			}
			catch (AtomicMoveNotSupportedException exception) {
				Files.move(temporary, path, StandardCopyOption.REPLACE_EXISTING);
			}
		}
		finally {
			Files.deleteIfExists(temporary);
		}
		return read(key);
	}

	private Path resolve(String key) {
		if (key == null || key.isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Model key is required");
		}
		if (key.startsWith("/")) {
			key = key.substring(1);
		}
		Path candidate = root.resolve(key).normalize();
		if (!candidate.startsWith(root) || Path.of(key).isAbsolute() || key.contains("..")) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Model key must stay inside the configured root");
		}
		try {
			if (Files.exists(candidate) && !candidate.toRealPath().startsWith(root.toRealPath())) {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Model key must stay inside the configured root");
			}
		}
		catch (IOException exception) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Model path cannot be resolved", exception);
		}
		return candidate;
	}

	private boolean isSupported(Path path) {
		String name = path.getFileName().toString().toLowerCase();
		return extensions.stream().anyMatch(name::endsWith);
	}

	private boolean isBpmn(Path path) {
		String name = path.getFileName().toString().toLowerCase();
		return name.endsWith(".bpmn") || name.endsWith(".bpmn20.xml");
	}

	private String toKey(Path path) {
		return root.relativize(path).toString().replace(path.getFileSystem().getSeparator(), "/");
	}

	private long lastModified(Path path) {
		try {
			return Files.getLastModifiedTime(path).toMillis();
		}
		catch (IOException exception) {
			return 0;
		}
	}

	private void validateXml(String xml) {
		try (InputStream input = new java.io.ByteArrayInputStream(xml.getBytes(StandardCharsets.UTF_8))) {
			DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
			factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
			factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
			factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
			factory.setXIncludeAware(false);
			factory.setExpandEntityReferences(false);
			var builder = factory.newDocumentBuilder();
			builder.setErrorHandler(new ErrorHandler() {
				@Override
				public void warning(SAXParseException exception) {
				}

				@Override
				public void error(SAXParseException exception) throws SAXException {
					throw exception;
				}

				@Override
				public void fatalError(SAXParseException exception) throws SAXException {
					throw exception;
				}
			});
			Document document = builder.parse(new InputSource(input));
			if (document.getDocumentElement() == null) {
				throw new IllegalArgumentException("XML document has no root element");
			}
		}
		catch (Exception exception) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Model XML is invalid", exception);
		}
	}

	private void watch() {
		while (!Thread.currentThread().isInterrupted()) {
			try {
				WatchKey key = watchService.take();
				Path directory = (Path) key.watchable();
				boolean changed = false;
				for (WatchEvent<?> event : key.pollEvents()) {
					if (event.kind() != java.nio.file.StandardWatchEventKinds.OVERFLOW) {
						changed = true;
						if (event.kind() == java.nio.file.StandardWatchEventKinds.ENTRY_CREATE) {
							Path created = directory.resolve((Path) event.context());
							if (Files.isDirectory(created)) {
								registerDirectory(created);
							}
						}
					}
				}
				if (!key.reset()) {
					return;
				}
				if (changed) {
					if (debounceMillis > 0) {
						Thread.sleep(debounceMillis);
					}
					revision.incrementAndGet();
				}
			}
			catch (InterruptedException exception) {
				Thread.currentThread().interrupt();
			}
			catch (IOException exception) {
				return;
			}
		}
	}

	private void registerDirectories() throws IOException {
		try (Stream<Path> paths = Files.walk(root)) {
			for (Path path : paths.filter(Files::isDirectory).toList()) {
				registerDirectory(path);
			}
		}
	}

	private void registerDirectory(Path directory) throws IOException {
		directory.register(watchService, java.nio.file.StandardWatchEventKinds.ENTRY_CREATE,
				java.nio.file.StandardWatchEventKinds.ENTRY_MODIFY,
				java.nio.file.StandardWatchEventKinds.ENTRY_DELETE);
	}

	public record ModelerFile(String key, long lastModified, long revision) {
	}

	public record ModelerFileContent(String key, String xml, long lastModified, long revision, boolean bpmn) {
	}
}
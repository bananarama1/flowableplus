package com.flowableplus.work.modeler;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.web.server.ResponseStatusException;

class ModelerFileServiceTest {

	@TempDir
	Path root;

	@Test
	void listsSupportedFilesAndRoundTripsXml() throws Exception {
		Files.writeString(root.resolve("approval.bpmn20.xml"), "<definitions />");
		Files.writeString(root.resolve("notes.txt"), "ignore");
		ModelerFileService service = service();

		assertEquals(List.of("approval.bpmn20.xml"), service.list().stream().map(ModelerFileService.ModelerFile::key).toList());
		ModelerFileService.ModelerFileContent saved = service.write("approval.bpmn20.xml", "<definitions><process id=\"approval\" /></definitions>");

		assertEquals("approval.bpmn20.xml", saved.key());
		assertEquals("<definitions><process id=\"approval\" /></definitions>", Files.readString(root.resolve("approval.bpmn20.xml")));
		service.stop();
	}

	@Test
	void rejectsTraversal() throws Exception {
		ModelerFileService service = service();

		assertThrows(ResponseStatusException.class, () -> service.read("../outside.bpmn20.xml"));
		service.stop();
	}

	@Test
	void readsNestedKeyWithLeadingSlash() throws Exception {
		Path directory = Files.createDirectories(root.resolve("approval"));
		Files.writeString(directory.resolve("process.bpmn20.xml"), "<definitions />");
		ModelerFileService service = service();

		ModelerFileService.ModelerFileContent content = service.read("/approval/process.bpmn20.xml");

		assertEquals("approval/process.bpmn20.xml", content.key());
		service.stop();
	}

	@Test
	void preservesExistingFileWhenXmlIsInvalid() throws Exception {
		Path file = root.resolve("approval.bpmn20.xml");
		Files.writeString(file, "<definitions />");
		ModelerFileService service = service();

		assertThrows(ResponseStatusException.class, () -> service.write("approval.bpmn20.xml", "<definitions>"));
		assertEquals("<definitions />", Files.readString(file));
		service.stop();
	}

	@Test
	void observesChangesInNestedDirectories() throws Exception {
		Path directory = Files.createDirectories(root.resolve("approval"));
		Path file = directory.resolve("process.bpmn20.xml");
		Files.writeString(file, "<definitions />");
		ModelerFileService service = service();
		long initialRevision = service.read("approval/process.bpmn20.xml").revision();

		Files.writeString(file, "<definitions><process id=\"updated\" /></definitions>");
		long revision = initialRevision;
		long deadline = System.currentTimeMillis() + 2000;
		while (revision == initialRevision && System.currentTimeMillis() < deadline) {
			Thread.sleep(25);
			revision = service.read("approval/process.bpmn20.xml").revision();
		}

		assertEquals(true, revision > initialRevision);
		service.stop();
	}

	private ModelerFileService service() throws Exception {
		FlowablePlusModelerProperties properties = new FlowablePlusModelerProperties();
		properties.setRoot(root);
		properties.setExtensions(List.of(".bpmn20.xml"));
		ModelerFileService service = new ModelerFileService(properties);
		service.start();
		return service;
	}
}
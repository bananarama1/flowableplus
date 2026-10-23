package com.flowableplus.work.modeler;

import java.io.IOException;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/plus/modeler")
public class FlowablePlusModelerController {

	private final ModelerFileService files;
	private final FlowablePlusModelerProperties properties;

	public FlowablePlusModelerController(ModelerFileService files, FlowablePlusModelerProperties properties) {
		this.files = files;
		this.properties = properties;
	}

	@GetMapping("/models")
	public List<ModelerFileService.ModelerFile> list(HttpServletRequest request) throws IOException {
		checkLocalAccess(request);
		return files.list();
	}

	@GetMapping("/models/{*key}")
	public ModelerFileService.ModelerFileContent read(@PathVariable String key, HttpServletRequest request)
			throws IOException {
		checkLocalAccess(request);
		return files.read(key);
	}

	@PutMapping("/models/{*key}")
	public ModelerFileService.ModelerFileContent write(@PathVariable String key, @RequestBody String xml,
			HttpServletRequest request)
			throws IOException {
		checkLocalAccess(request);
		return files.write(key, xml);
	}

	private void checkLocalAccess(HttpServletRequest request) {
		if (!properties.isLocalOnly()) {
			return;
		}
		String address = request.getRemoteAddr();
		if (!"127.0.0.1".equals(address) && !"0:0:0:0:0:0:0:1".equals(address) && !"::1".equals(address)) {
			throw new org.springframework.web.server.ResponseStatusException(
					org.springframework.http.HttpStatus.FORBIDDEN, "Modeler is available only from localhost");
		}
	}
}
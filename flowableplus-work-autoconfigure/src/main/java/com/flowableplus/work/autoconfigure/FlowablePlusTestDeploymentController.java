package com.flowableplus.work.autoconfigure;

import java.util.Arrays;
import java.util.Comparator;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.flowable.app.api.AppRepositoryService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class FlowablePlusTestDeploymentController {

	private final AppRepositoryService appRepositoryService;
	private final Set<String> createdDeploymentIds = ConcurrentHashMap.newKeySet();

	public FlowablePlusTestDeploymentController(AppRepositoryService appRepositoryService) {
		this.appRepositoryService = appRepositoryService;
	}

	@PostMapping("/flowableplus-api/plus/test/app-deployments")
	public ResponseEntity<DeploymentResponse> deploy(@RequestBody DeploymentRequest request) throws Exception {
		String directory = normalizeDirectory(request.resourcePath());
		Resource[] resources = new PathMatchingResourcePatternResolver(getClass().getClassLoader())
				.getResources("classpath*:" + directory + "/**/*");
		Arrays.sort(resources, Comparator.comparing(Resource::getDescription));

		var deploymentBuilder = appRepositoryService.createDeployment()
				.name("Playwright test app deployment: " + directory);
		int resourceCount = 0;
		for (Resource resource : resources) {
			if (resource.isReadable() && !resource.getURL().toExternalForm().endsWith("/")) {
				deploymentBuilder.addClasspathResource(classpathResource(resource, directory));
				resourceCount++;
			}
		}
		if (resourceCount == 0) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND,
					"No classpath resources found under '" + directory + "'");
		}
		if (request.tenantId() != null && !request.tenantId().isBlank()) {
			deploymentBuilder.tenantId(request.tenantId());
		}

		var deployment = deploymentBuilder.deploy();
		createdDeploymentIds.add(deployment.getId());
		return ResponseEntity.status(HttpStatus.CREATED).body(new DeploymentResponse(deployment.getId()));
	}

	@DeleteMapping("/flowableplus-api/plus/test/app-deployments/{deploymentId}")
	public ResponseEntity<Void> delete(@PathVariable String deploymentId) {
		if (!createdDeploymentIds.remove(deploymentId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Deployment was not created by this endpoint");
		}
		appRepositoryService.deleteDeployment(deploymentId, true);
		return ResponseEntity.noContent().build();
	}

	private static String classpathResource(Resource resource, String directory) throws Exception {
		String url = resource.getURL().toExternalForm();
		String marker = "/" + directory + "/";
		int directoryIndex = url.lastIndexOf(marker);
		if (directoryIndex < 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"Could not determine classpath resource path");
		}
		return url.substring(directoryIndex + 1);
	}

	private static String normalizeDirectory(String directory) {
		if (directory == null || directory.isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "resourcePath must not be blank");
		}
		String normalized = directory.replaceAll("^/+|/+$", "");
		if (normalized.isBlank() || Arrays.asList(normalized.split("/")).contains("..")) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "resourcePath must be a classpath directory");
		}
		return normalized;
	}

	public record DeploymentRequest(String resourcePath, String tenantId) {
	}

	public record DeploymentResponse(String deploymentId) {
	}
}
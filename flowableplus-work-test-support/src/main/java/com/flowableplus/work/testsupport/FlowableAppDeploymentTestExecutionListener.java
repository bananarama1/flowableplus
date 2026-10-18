package com.flowableplus.work.testsupport;

import java.io.IOException;
import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.Set;

import org.flowable.app.api.AppRepositoryService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.test.context.TestContext;
import org.springframework.test.context.TestExecutionListener;

public final class FlowableAppDeploymentTestExecutionListener implements TestExecutionListener {

	private static final String DEPLOYMENT_ID_ATTRIBUTE =
			FlowableAppDeploymentTestExecutionListener.class.getName() + ".deploymentId";

	@Override
	public void beforeTestClass(TestContext testContext) throws Exception {
		DeployFlowableApp annotation = testContext.getTestClass().getAnnotation(DeployFlowableApp.class);
		if (annotation == null) {
			return;
		}

		String directory = normalizeDirectory(annotation.value());
		Resource[] resources = new PathMatchingResourcePatternResolver(testContext.getTestClass().getClassLoader())
				.getResources("classpath*:" + directory + "/**/*");
		Arrays.sort(resources, Comparator.comparing(resource -> resource.getDescription()));

		AppRepositoryService appRepositoryService = testContext.getApplicationContext()
				.getBean(AppRepositoryService.class);
		var deploymentBuilder = appRepositoryService.createDeployment()
				.name("Test app deployment for " + testContext.getTestClass().getName());
		Set<String> addedResources = new LinkedHashSet<>();

		for (Resource resource : resources) {
			String url = resource.getURL().toExternalForm();
			if (url.endsWith("/")) {
				continue;
			}

			String marker = "/" + directory + "/";
			int directoryIndex = url.lastIndexOf(marker);
			if (directoryIndex < 0) {
				throw new IllegalStateException("Could not determine classpath resource path for " + url);
			}
			String classpathResource = url.substring(directoryIndex + 1);
			if (addedResources.add(classpathResource)) {
				deploymentBuilder.addClasspathResource(classpathResource);
			}
		}

		if (addedResources.isEmpty()) {
			throw new IllegalArgumentException("No classpath resources found under '" + directory + "'");
		}

		var deployment = deploymentBuilder.deploy();
		testContext.setAttribute(DEPLOYMENT_ID_ATTRIBUTE, deployment.getId());
	}

	@Override
	public void afterTestClass(TestContext testContext) {
		Object deploymentId = testContext.removeAttribute(DEPLOYMENT_ID_ATTRIBUTE);
		if (deploymentId != null) {
			testContext.getApplicationContext().getBean(AppRepositoryService.class)
					.deleteDeployment(deploymentId.toString(), true);
		}
	}

	private static String normalizeDirectory(String directory) {
		if (directory == null || directory.isBlank()) {
			throw new IllegalArgumentException("The app resource directory must not be blank");
		}

		String normalized = directory.replaceAll("^/+|/+$", "");
		if (Arrays.asList(normalized.split("/")).contains("..")) {
			throw new IllegalArgumentException("The app resource directory must not contain '..'");
		}
		return normalized;
	}
}

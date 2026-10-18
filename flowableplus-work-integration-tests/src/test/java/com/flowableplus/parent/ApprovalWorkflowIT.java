package com.flowableplus.parent;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClient;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.PostgreSQLContainer;

import com.flowableplus.work.testsupport.FlowablePlusTestContainers;

import static org.junit.jupiter.api.Assertions.fail;

@SpringBootTest(classes = com.flowableplus.work.integration.FlowablePlusIntegrationTestApplication.class,
		webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class ApprovalWorkflowIT {

	@ServiceConnection
	static final PostgreSQLContainer<?> postgres = FlowablePlusTestContainers.postgres();

	static final GenericContainer<?> mailpit = FlowablePlusTestContainers.mailpit();

	static {
		postgres.start();
		mailpit.start();
	}

	@DynamicPropertySource
	static void mailProperties(DynamicPropertyRegistry registry) {
		registry.add("spring.mail.host", mailpit::getHost);
		registry.add("spring.mail.port", () -> mailpit.getMappedPort(1025));
	}

	@Autowired
	private WebApplicationContext applicationContext;

	@LocalServerPort
	private int port;

	private MockMvc mockMvc;

	@BeforeEach
	void setUpMockMvc() {
		mockMvc = MockMvcBuilders.webAppContextSetup(applicationContext)
				.apply(springSecurity())
				.build();
	}

	@Test
	void reqApp001AuthenticateTheUser() throws Exception {
		mockMvc.perform(post("/login")
				.param("username", "demo")
				.param("password", "demo")
				.with(csrf()))
			.andExpect(status().is3xxRedirection())
			.andExpect(redirectedUrl("/"))
			.andReturn();
	}

	@Test
	void reqApp002RejectUnauthenticatedApiAccess() throws Exception {
		ResponseEntity<String> response = restClient().get()
				.retrieve()
				.onStatus(statusCode -> statusCode.isError(), (request, errorResponse) -> {
				})
				.toEntity(String.class);

		assertThat(response.getStatusCode().value()).isIn(401, 302, 303, 307, 308);
	}

	@Test
	void reqApp003ListDeployedProcessDefinitions() throws Exception {
		ResponseEntity<String> response = restClient().get()
				.headers(headers -> headers.setBasicAuth("demo", "demo"))
				.retrieve()
				.toEntity(String.class);

		assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
		assertThat(response.getBody()).contains("simpleApprovalProcess");
	}

	@Test
	void deploysAndDeletesAnIsolatedTestApp() {
		RestClient client = RestClient.builder()
				.baseUrl("http://localhost:" + port + "/plus/test/app-deployments")
				.defaultHeaders(headers -> headers.setBasicAuth("demo", "demo"))
				.build();

		Map<?, ?> deployment = client.post()
				.body(Map.of("resourcePath", "app-processes", "tenantId", ""))
				.retrieve()
				.body(Map.class);
		String deploymentId = (String) deployment.get("deploymentId");
		assertThat(deploymentId).isNotBlank();

		client.delete().uri("/{deploymentId}", deploymentId).retrieve().toBodilessEntity();
	}

	private RestClient restClient() {
		return RestClient.builder()
				.baseUrl("http://localhost:" + port + "/flowableplus-api/repository/process-definitions")
				.build();
	}

	@Test
	void reqApp004StartAnApprovalProcess() {
		fail("REQ-APP-004 not implemented");
	}

	@Test
	void reqApp005ViewTheCandidateTask() {
		fail("REQ-APP-005 not implemented");
	}

	@Test
	void reqApp006ClaimTheTask() {
		fail("REQ-APP-006 not implemented");
	}

	@Test
	void reqApp007CompleteTheAssignedTask() {
		fail("REQ-APP-007 not implemented");
	}

	@Test
	void reqApp008RejectUnauthorizedTaskCompletion() {
		fail("REQ-APP-008 not implemented");
	}

	@Test
	void reqApp009ReportTaskConflicts() {
		fail("REQ-APP-009 not implemented");
	}

	@Test
	void reqApp010ReportFlowableValidationErrors() {
		fail("REQ-APP-010 not implemented");
	}
}
package com.flowableplus.parent;

import org.flowable.app.api.AppRepositoryService;
import org.flowable.cmmn.api.CmmnRuntimeService;
import org.flowable.cmmn.api.repository.CmmnDeployment;
import org.flowable.cmmn.engine.CmmnEngine;
import org.flowable.engine.ProcessEngine;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.flowable.engine.repository.Deployment;
import org.flowable.engine.runtime.ProcessInstance;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.PostgreSQLContainer;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class ParentApplicationIT {

	@ServiceConnection
	static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

	static final GenericContainer<?> mailpit = new GenericContainer<>("axllent/mailpit:v1.21.8")
			.withExposedPorts(1025, 8025);

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
	private RuntimeService runtimeService;

	@Autowired
	private AppRepositoryService appRepositoryService;

	@Autowired
	private ProcessEngine processEngine;

	@Autowired
	private CmmnRuntimeService cmmnRuntimeService;

	@Autowired
	private CmmnEngine cmmnEngine;

	@Autowired
	private TaskService taskService;

	@Test
	void contextLoads() {
	}

	@Test
	void startsSimpleProcessInstance() {
		var processInstance = runtimeService.startProcessInstanceByKey("simpleProcess");

		assertThat(processInstance.getProcessDefinitionKey()).isEqualTo("simpleProcess");
	}

	@Test
	void testAppDeployment() {
		appRepositoryService.createDeployment()
				.name("testDeployment")
				.addClasspathResource("app-processes/app-simple-process.bpmn20.xml")
				.addClasspathResource("app-processes/app-simple-approval-process.bpmn20.xml")
				.addClasspathResource("app-processes/app-simple-case.cmmn")
				.deploy();

		ProcessInstance appSimpleProcess = runtimeService.startProcessInstanceByKey("appSimpleProcess");
		Deployment deployment1 = processEngine.getRepositoryService().createDeploymentQuery()
				.deploymentId(appSimpleProcess.getDeploymentId())
				.singleResult();

		ProcessInstance appSimpleApprovalProcess = runtimeService.startProcessInstanceByKey("appSimpleApprovalProcess");
		Deployment deployment2 = processEngine.getRepositoryService().createDeploymentQuery()
				.deploymentId(appSimpleApprovalProcess.getDeploymentId())
				.singleResult();
		assertThat(deployment2.getParentDeploymentId()).isNotBlank();

		var caseInstance = cmmnRuntimeService.createCaseInstanceBuilder()
				.caseDefinitionKey("appSimpleCase")
				.start();
		assertThat(caseInstance.getCaseDefinitionKey()).isEqualTo("appSimpleCase");
		assertThat(caseInstance.getCaseDefinitionDeploymentId()).isNotBlank();

		CmmnDeployment deployment3 = cmmnEngine.getCmmnRepositoryService().createDeploymentQuery()
				.deploymentId(caseInstance.getCaseDefinitionDeploymentId())
				.singleResult();

		assertThat(deployment1.getParentDeploymentId())
				.isEqualTo(deployment2.getParentDeploymentId())
				.isEqualTo(deployment3.getParentDeploymentId());

		var approvalTask = taskService.createTaskQuery()
				.processInstanceId(appSimpleApprovalProcess.getId())
				.singleResult();

		assertThat(approvalTask).isNotNull();
	}
}
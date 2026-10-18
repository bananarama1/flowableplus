package com.flowableplus.parent;

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

import com.flowableplus.work.testsupport.FlowablePlusTestContainers;
import com.flowableplus.work.testsupport.DeployFlowableApp;

@SpringBootTest(classes = com.flowableplus.work.integration.FlowablePlusIntegrationTestApplication.class)
@ActiveProfiles("test")
@DeployFlowableApp("flowablePlus/apps/simple-approval")
class ParentApplicationIT {

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
	private RuntimeService runtimeService;

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
		ProcessInstance appSimpleProcess = runtimeService.startProcessInstanceByKey("simpleProcess");
		Deployment deployment1 = processEngine.getRepositoryService().createDeploymentQuery()
				.deploymentId(appSimpleProcess.getDeploymentId())
				.singleResult();

		ProcessInstance appSimpleApprovalProcess = runtimeService.startProcessInstanceByKey("simpleApprovalProcess");
		Deployment deployment2 = processEngine.getRepositoryService().createDeploymentQuery()
				.deploymentId(appSimpleApprovalProcess.getDeploymentId())
				.singleResult();
		assertThat(deployment2.getParentDeploymentId()).isNotBlank();

		var caseInstance = cmmnRuntimeService.createCaseInstanceBuilder()
				.caseDefinitionKey("simpleCase")
				.start();
		assertThat(caseInstance.getCaseDefinitionKey()).isEqualTo("simpleCase");
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
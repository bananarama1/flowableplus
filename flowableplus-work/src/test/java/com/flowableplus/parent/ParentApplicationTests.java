package com.flowableplus.parent;

import org.junit.jupiter.api.Test;
import org.flowable.app.api.AppRepositoryService;
import org.flowable.cmmn.api.CmmnRuntimeService;
import org.flowable.cmmn.api.repository.CaseDefinition;
import org.flowable.cmmn.api.repository.CmmnDeployment;
import org.flowable.engine.ProcessEngine;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.flowable.cmmn.api.runtime.CaseInstance;
import org.flowable.cmmn.engine.CmmnEngine;
import org.flowable.engine.repository.Deployment;
import org.flowable.engine.runtime.ProcessInstance;
import org.flowable.task.api.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

import org.assertj.core.api.Assertions;

@SpringBootTest
class ParentApplicationTests {

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
		Assertions.assertThat(deployment2.getParentDeploymentId()).isNotBlank();
		
		CaseInstance caseInstance = cmmnRuntimeService.createCaseInstanceBuilder()
		.caseDefinitionKey("appSimpleCase")
		.start();
		Assertions.assertThat(caseInstance.getCaseDefinitionKey()).isEqualTo("appSimpleCase");
		Assertions.assertThat(caseInstance.getCaseDefinitionDeploymentId()).isNotBlank();
		
		CmmnDeployment deployment3 = cmmnEngine.getCmmnRepositoryService().createDeploymentQuery().deploymentId(caseInstance.getCaseDefinitionDeploymentId()).singleResult();
		
		Assertions.assertThat(deployment1.getParentDeploymentId())
			.isEqualTo(deployment2.getParentDeploymentId())
			.isEqualTo(deployment3.getParentDeploymentId());


		Task approvalTask  = taskService.createTaskQuery()
				.processInstanceId(appSimpleApprovalProcess.getId())
				.singleResult();

		Assertions.assertThat(approvalTask).isNotNull();
	}

}

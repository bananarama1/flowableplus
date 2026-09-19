package com.flowableplus.work;

import static org.assertj.core.api.Assertions.assertThat;

import org.flowable.cmmn.api.CmmnRepositoryService;
import org.flowable.cmmn.api.repository.CmmnDeployment;
import org.flowable.engine.RepositoryService;
import org.flowable.engine.repository.Deployment;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class FlowableCompatibilityTests {

    private static final String BPMN_MODEL = """
            <?xml version="1.0" encoding="UTF-8"?>
            <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
                         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                         targetNamespace="http://flowableplus.com/test">
                <process id="compatibilityProcess" name="Compatibility Process" isExecutable="true">
                    <startEvent id="start" />
                    <endEvent id="end" />
                    <sequenceFlow id="flow" sourceRef="start" targetRef="end" />
                </process>
            </definitions>
            """;

    private static final String CMMN_MODEL = """
            <?xml version="1.0" encoding="UTF-8"?>
            <definitions xmlns="http://www.omg.org/spec/CMMN/20151109/MODEL"
                         targetNamespace="http://flowableplus.com/test">
                <case id="compatibilityCase" name="Compatibility Case">
                    <casePlanModel id="casePlanModel" name="Compatibility Case Plan">
                        <planItem id="planItem" definitionRef="humanTask" />
                        <humanTask id="humanTask" name="Human Task" />
                    </casePlanModel>
                </case>
            </definitions>
            """;

    @Autowired
    private RepositoryService repositoryService;

    @Autowired
    private CmmnRepositoryService cmmnRepositoryService;

    @Test
    void deploysBpmnDefinitionWithConfiguredFlowableVersion() {
        Deployment deployment = repositoryService.createDeployment()
                .addString("compatibility.bpmn20.xml", BPMN_MODEL)
                .deploy();

        assertThat(repositoryService.createProcessDefinitionQuery()
                .deploymentId(deployment.getId())
                .singleResult()
                .getKey()).isEqualTo("compatibilityProcess");
    }

    @Test
    void deploysCmmnDefinitionWithConfiguredFlowableVersion() {
        CmmnDeployment deployment = cmmnRepositoryService.createDeployment()
                .addString("compatibility.cmmn", CMMN_MODEL)
                .deploy();

        assertThat(cmmnRepositoryService.createCaseDefinitionQuery()
                .deploymentId(deployment.getId())
                .singleResult()
                .getKey()).isEqualTo("compatibilityCase");
    }
}
package com.flowableplus.work;

import static org.assertj.core.api.Assertions.assertThat;

import org.flowable.cmmn.api.CmmnRepositoryService;
import org.flowable.cmmn.engine.CmmnEngine;
import org.flowable.cmmn.engine.impl.cfg.StandaloneInMemCmmnEngineConfiguration;
import org.flowable.engine.ProcessEngine;
import org.flowable.engine.RepositoryService;
import org.flowable.engine.impl.cfg.StandaloneProcessEngineConfiguration;
import org.junit.jupiter.api.Test;

class PerClientFlowableIsolationTests {

    private static final String BPMN_MODEL = """
            <?xml version="1.0" encoding="UTF-8"?>
            <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
                         targetNamespace="http://flowableplus.com/isolation">
                <process id="sameKey" isExecutable="true">
                    <startEvent id="start" />
                    <endEvent id="end" />
                    <sequenceFlow id="flow" sourceRef="start" targetRef="end" />
                </process>
            </definitions>
            """;

    private static final String CMMN_MODEL = """
            <?xml version="1.0" encoding="UTF-8"?>
            <definitions xmlns="http://www.omg.org/spec/CMMN/20151109/MODEL"
                         targetNamespace="http://flowableplus.com/isolation">
                <case id="sameKey">
                    <casePlanModel id="plan">
                        <planItem id="item" definitionRef="task" />
                        <humanTask id="task" />
                    </casePlanModel>
                </case>
            </definitions>
            """;

    @Test
    void separateBpmnDatabasesIsolateIdenticalDefinitionKeys() {
        ProcessEngine clientA = processEngine("client_a");
        ProcessEngine clientB = processEngine("client_b");
        try {
            deployBpmn(clientA.getRepositoryService());
            deployBpmn(clientB.getRepositoryService());

            assertThat(clientA.getRepositoryService().createProcessDefinitionQuery().processDefinitionKey("sameKey").count())
                    .isEqualTo(1);
            assertThat(clientB.getRepositoryService().createProcessDefinitionQuery().processDefinitionKey("sameKey").count())
                    .isEqualTo(1);
        } finally {
            clientA.close();
            clientB.close();
        }
    }

    @Test
    void separateCmmnDatabasesIsolateIdenticalCaseKeys() {
        CmmnEngine clientA = cmmnEngine("cmmn_client_a");
        CmmnEngine clientB = cmmnEngine("cmmn_client_b");
        deployCmmn(clientA.getCmmnRepositoryService());
        deployCmmn(clientB.getCmmnRepositoryService());

        assertThat(clientA.getCmmnRepositoryService().createCaseDefinitionQuery().caseDefinitionKey("sameKey").count())
            .isEqualTo(1);
        assertThat(clientB.getCmmnRepositoryService().createCaseDefinitionQuery().caseDefinitionKey("sameKey").count())
            .isEqualTo(1);
    }

    private ProcessEngine processEngine(String databaseName) {
        return new StandaloneProcessEngineConfiguration()
                .setJdbcUrl("jdbc:h2:mem:" + databaseName + ";DB_CLOSE_DELAY=-1")
                .setJdbcDriver("org.h2.Driver")
                .setJdbcUsername("sa")
                .setJdbcPassword("")
                .setDatabaseSchemaUpdate("create-drop")
                .buildProcessEngine();
    }

    private CmmnEngine cmmnEngine(String databaseName) {
        StandaloneInMemCmmnEngineConfiguration configuration = new StandaloneInMemCmmnEngineConfiguration();
        configuration.setJdbcUrl("jdbc:h2:mem:" + databaseName + ";DB_CLOSE_DELAY=-1");
        configuration.setJdbcDriver("org.h2.Driver");
        configuration.setJdbcUsername("sa");
        configuration.setJdbcPassword("");
        configuration.setDatabaseSchemaUpdate("create-drop");
        return configuration.buildCmmnEngine();
    }

    private void deployBpmn(RepositoryService repositoryService) {
        repositoryService.createDeployment().addString("same.bpmn20.xml", BPMN_MODEL).deploy();
    }

    private void deployCmmn(CmmnRepositoryService repositoryService) {
        repositoryService.createDeployment().addString("same.cmmn", CMMN_MODEL).deploy();
    }
}
package com.flowableplus.work;

import static org.assertj.core.api.Assertions.assertThat;

import com.flowableplus.contracts.DocumentPayload;
import com.flowableplus.contracts.ModelType;
import com.flowableplus.flowable.adapter.DefaultFlowableRuntimeAdapter;
import com.flowableplus.flowable.adapter.DeploymentReference;
import org.flowable.cmmn.api.CmmnHistoryService;
import org.flowable.cmmn.api.CmmnRepositoryService;
import org.flowable.cmmn.api.CmmnRuntimeService;
import org.flowable.engine.HistoryService;
import org.flowable.engine.RepositoryService;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class FlowableAdapterIntegrationTests {

    private static final String BPMN_MODEL = """
            <?xml version="1.0" encoding="UTF-8"?>
            <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
                         targetNamespace="http://flowableplus.com/test">
                <process id="adapterProcess" isExecutable="true">
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
                <case id="adapterCase">
                    <casePlanModel id="casePlanModel">
                        <planItem id="planItem" definitionRef="humanTask" />
                        <humanTask id="humanTask" />
                    </casePlanModel>
                </case>
            </definitions>
            """;

    @Autowired
    private RepositoryService repositoryService;

    @Autowired
    private CmmnRepositoryService cmmnRepositoryService;

    @Autowired
    private RuntimeService runtimeService;

    @Autowired
    private CmmnRuntimeService cmmnRuntimeService;

    @Autowired
    private TaskService taskService;

    @Autowired
    private HistoryService historyService;

    @Autowired
    private CmmnHistoryService cmmnHistoryService;

    @Test
    void adapterDeploysBpmnAndCmmnThroughRealFlowableServices() {
        DefaultFlowableRuntimeAdapter adapter = new DefaultFlowableRuntimeAdapter(
                repositoryService, cmmnRepositoryService, runtimeService, cmmnRuntimeService,
                taskService, historyService, cmmnHistoryService);

        DeploymentReference bpmn = adapter.deployBpmn(
                new DocumentPayload(ModelType.BPMN, "adapter.bpmn20.xml", BPMN_MODEL));
        DeploymentReference cmmn = adapter.deployCmmn(
                new DocumentPayload(ModelType.CMMN, "adapter.cmmn", CMMN_MODEL));

        assertThat(bpmn.definitionKey()).isEqualTo("adapterProcess");
        assertThat(cmmn.definitionKey()).isEqualTo("adapterCase");
    }
}
package com.flowableplus.work;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;
import java.util.Map;

import com.flowableplus.contracts.ClientScope;
import com.flowableplus.contracts.DocumentPayload;
import com.flowableplus.contracts.ModelIdentity;
import com.flowableplus.contracts.ModelType;
import com.flowableplus.contracts.ModelVersion;
import com.flowableplus.contracts.PublicationEnvelope;
import com.flowableplus.contracts.PublicationStatus;
import com.flowableplus.contracts.VersionState;
import com.flowableplus.flowable.adapter.CaseExecution;
import com.flowableplus.flowable.adapter.HistoryEntry;
import com.flowableplus.work.publication.PublicationIntakeService;
import com.flowableplus.work.runtime.RuntimeAccessException;
import com.flowableplus.work.runtime.RuntimeExecutionService;
import org.flowable.cmmn.api.CmmnHistoryService;
import org.flowable.cmmn.api.CmmnRuntimeService;
import org.flowable.cmmn.api.CmmnTaskService;
import org.flowable.cmmn.api.history.HistoricMilestoneInstance;
import org.flowable.cmmn.api.history.HistoricPlanItemInstance;
import org.flowable.task.api.Task;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CmmnVerticalSliceIntegrationTests {

    private static final String CMMN_MODEL = """
            <?xml version="1.0" encoding="UTF-8"?>
            <definitions xmlns="http://www.omg.org/spec/CMMN/20151109/MODEL"
                         targetNamespace="http://flowableplus.com/vertical-slice">
                <case id="cmmnVerticalCase" name="CMMN Vertical Case">
                    <casePlanModel id="cmmnVerticalPlan" name="CMMN Vertical Plan">
                        <planItem id="approvalPlanItem" definitionRef="approvalTask" />
                        <humanTask id="approvalTask" name="Approve request" />
                    </casePlanModel>
                </case>
            </definitions>
            """;

        private static final String SUPPORTED_ELEMENTS_MODEL = """
                        <?xml version="1.0" encoding="UTF-8"?>
                        <definitions xmlns="http://www.omg.org/spec/CMMN/20151109/MODEL"
                                                 xmlns:flowable="http://flowable.org/cmmn"
                                                 targetNamespace="http://flowableplus.com/capability-matrix">
                                <case id="cmmnSupportedElementsCase" name="Supported CMMN Elements">
                                        <casePlanModel id="supportedPlan" name="Supported Plan">
                                                <planItem id="approvalStageItem" definitionRef="approvalStage" />
                                                <stage id="approvalStage" name="Approval Stage">
                                                        <planItem id="approvalTaskItem" definitionRef="approvalTask" />
                                                        <planItem id="approvedMilestoneItem" definitionRef="approvedMilestone">
                                                                <entryCriterion id="approvedEntry" sentryRef="approvedSentry" />
                                                        </planItem>
                                                        <sentry id="approvedSentry">
                                                                <ifPart>
                                                                        <condition>${approved == true}</condition>
                                                                </ifPart>
                                                        </sentry>
                                                        <humanTask id="approvalTask" name="Approve request" flowable:assignee="worker" />
                                                        <milestone id="approvedMilestone" name="Approved" />
                                                </stage>
                                        </casePlanModel>
                                </case>
                        </definitions>
                        """;

    @Autowired
    private PublicationIntakeService publicationService;

    @Autowired
    private RuntimeExecutionService runtimeService;

        @Autowired
        private CmmnRuntimeService cmmnRuntimeService;

        @Autowired
        private CmmnTaskService cmmnTaskService;

        @Autowired
        private CmmnHistoryService cmmnHistoryService;

    @Test
    void publishesStartsAndInspectsSupportedCmmnCase() {
        PublicationIntakeService.IntakeResult publication = publicationService.accept(
                publication("cmmn-vertical-1", "correlation-cmmn-1"), "worker");

        assertThat(publication.result().status()).isEqualTo(PublicationStatus.ACTIVE);

        CaseExecution execution = runtimeService.startCase(
                "client-local", "cmmnVerticalCase", Map.of("requestType", "travel"), "worker");
        HistoryEntry history = runtimeService.caseHistory("client-local", execution.caseInstanceId(), "worker");

        assertThat(execution.caseDefinitionKey()).isEqualTo("cmmnVerticalCase");
        assertThat(history).extracting(HistoryEntry::definitionKey, HistoryEntry::state)
                .containsExactly("cmmnVerticalCase", "ACTIVE");
    }

    @Test
    void rejectsCaseHistoryFromAnotherClientScope() {
        PublicationIntakeService.IntakeResult publication = publicationService.accept(
                publication("cmmn-vertical-2", "correlation-cmmn-2"), "worker");
        assertThat(publication.result().status()).isEqualTo(PublicationStatus.ACTIVE);

        CaseExecution execution = runtimeService.startCase(
                "client-local", "cmmnVerticalCase", Map.of(), "worker");

        assertThatThrownBy(() -> runtimeService.caseHistory(
                "other-client", execution.caseInstanceId(), "worker"))
                .isInstanceOf(RuntimeAccessException.class);
    }

    @Test
    void executesSupportedStageTaskSentryMilestoneAndVariables() {
        PublicationIntakeService.IntakeResult publication = publicationService.accept(
                publication("cmmnSupportedElementsCase", SUPPORTED_ELEMENTS_MODEL,
                        "correlation-cmmn-supported", "cmmn-supported-1"), "worker");
        assertThat(publication.result().status()).isEqualTo(PublicationStatus.ACTIVE);

        CaseExecution execution = runtimeService.startCase(
                "client-local", "cmmnSupportedElementsCase", Map.of("approved", false), "worker");
        Task task = cmmnTaskService.createTaskQuery()
                .caseInstanceId(execution.caseInstanceId())
                .singleResult();

        assertThat(task).isNotNull();
        assertThat(task.getName()).isEqualTo("Approve request");
        assertThat(task.getAssignee()).isEqualTo("worker");
        assertThat(cmmnRuntimeService.getVariable(execution.caseInstanceId(), "approved"))
                .isEqualTo(false);

        cmmnTaskService.complete(task.getId(), Map.of("approved", true));

        HistoricPlanItemInstance completedTask = cmmnHistoryService.createHistoricPlanItemInstanceQuery()
                .planItemInstanceCaseInstanceId(execution.caseInstanceId())
                .planItemInstanceElementId("approvalTaskItem")
                .singleResult();
        HistoricMilestoneInstance milestone = cmmnHistoryService.createHistoricMilestoneInstanceQuery()
                .milestoneInstanceCaseInstanceId(execution.caseInstanceId())
                .singleResult();
        HistoryEntry history = runtimeService.caseHistory("client-local", execution.caseInstanceId(), "worker");

        assertThat(completedTask.getState()).isEqualTo("completed");
        assertThat(milestone).isNotNull();
        assertThat(history.state()).isEqualTo("COMPLETED");
    }

    private PublicationEnvelope publication(String correlationId, String idempotencyKey) {
        return publication("cmmnVerticalCase", CMMN_MODEL, correlationId, idempotencyKey);
    }

    private PublicationEnvelope publication(
            String modelKey, String xml, String correlationId, String idempotencyKey) {
        ModelIdentity identity = new ModelIdentity(
                new ClientScope("client-local"), modelKey, ModelType.CMMN, modelKey);
        return new PublicationEnvelope(
                identity,
                new ModelVersion(identity, 1, VersionState.VALIDATED, "sha256:cmmn-vertical"),
                new DocumentPayload(ModelType.CMMN, modelKey + ".cmmn", xml),
                null, idempotencyKey, correlationId, "worker");
    }
}
package com.flowableplus.work;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.tuple;

import java.util.List;
import java.util.Map;

import com.flowableplus.contracts.ClientScope;
import com.flowableplus.contracts.DocumentPayload;
import com.flowableplus.contracts.FormField;
import com.flowableplus.contracts.FormFieldType;
import com.flowableplus.contracts.FormSchema;
import com.flowableplus.contracts.ModelIdentity;
import com.flowableplus.contracts.ModelType;
import com.flowableplus.contracts.ModelVersion;
import com.flowableplus.contracts.PublicationEnvelope;
import com.flowableplus.contracts.PublicationStatus;
import com.flowableplus.contracts.RuntimeDefinition;
import com.flowableplus.contracts.VersionState;
import com.flowableplus.flowable.adapter.HistoryEntry;
import com.flowableplus.flowable.adapter.ProcessExecution;
import com.flowableplus.flowable.adapter.TaskSummary;
import com.flowableplus.work.publication.PublicationIntakeService;
import com.flowableplus.work.publication.PublicationRecordRepository;
import com.flowableplus.work.audit.AuditEventService;
import com.flowableplus.work.runtime.RuntimeAccessException;
import com.flowableplus.work.runtime.RuntimeExecutionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BpmnVerticalSliceIntegrationTests {

    private static final String BPMN_MODEL = """
            <?xml version="1.0" encoding="UTF-8"?>
            <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
                         xmlns:flowable="http://flowable.org/bpmn"
                         targetNamespace="http://flowableplus.com/vertical-slice">
                <process id="bpmnVerticalProcess" name="BPMN Vertical Process" isExecutable="true">
                    <startEvent id="start" />
                    <sequenceFlow id="toApproval" sourceRef="start" targetRef="approval" />
                    <userTask id="approval" name="Approve request" flowable:assignee="worker" />
                    <sequenceFlow id="toEnd" sourceRef="approval" targetRef="end" />
                    <endEvent id="end" />
                </process>
            </definitions>
            """;

    @Autowired
    private PublicationIntakeService publicationService;

        @Autowired
        private PublicationRecordRepository publicationRepository;

    @Autowired
    private RuntimeExecutionService runtimeService;

        @Autowired
        private AuditEventService auditEventService;

    @Test
    void publishesStartsCompletesAndAuditsRepresentativeProcess() {
        PublicationIntakeService.IntakeResult publication = publicationService.accept(
                publication("bpmnVerticalProcess", BPMN_MODEL, "correlation-bpmn-1", "bpmn-vertical-1", "client-local"),
                "worker");

        assertThat(publication.result().status()).isEqualTo(PublicationStatus.ACTIVE);
        assertThat(publicationService.activeDefinitions("client-local", "worker"))
                .containsExactly(new RuntimeDefinition(
                        new ClientScope("client-local"), "bpmnVerticalProcess", ModelType.BPMN, 1,
                        "BPMN Vertical Process", true, publication.result().runtimeReference()));
        assertThat(publicationService.activeDefinitions("other-client", "worker")).isEmpty();

        assertThatThrownBy(() -> runtimeService.startProcess(
                "client-local", "bpmnVerticalProcess", Map.of(), "worker"))
                .isInstanceOf(com.flowableplus.work.runtime.RuntimeStartValidationException.class);

        ProcessExecution execution = runtimeService.startProcess(
                "client-local", "bpmnVerticalProcess", Map.of("requestType", "travel"), "worker");
        RuntimeExecutionService.TaskDetail task = runtimeService.tasks("client-local", "worker").stream()
                .filter(candidate -> candidate.processInstanceId().equals(execution.processInstanceId()))
                .findFirst()
                .map(candidate -> runtimeService.task("client-local", candidate.taskId(), "worker"))
                .orElseThrow();

        assertThat(runtimeService.form("client-local", task.task().taskId(), "worker").fields())
                .extracting(FormField::label)
                .containsExactly("Request type");
        RuntimeExecutionService.SubmissionResult invalid = runtimeService.submitTask(
                "client-local", task.task().taskId(), Map.of(), "worker");
        assertThat(invalid.errors()).extracting(error -> error.code()).containsExactly("REQUIRED");

        RuntimeExecutionService.SubmissionResult completed = runtimeService.submitTask(
                "client-local", task.task().taskId(), Map.of("requestType", "travel"), "worker");
        assertThat(completed.errors()).isEmpty();
        assertThat(completed.nextTasks()).isEmpty();

        HistoryEntry history = runtimeService.processHistory(
                "client-local", execution.processInstanceId(), "worker");
        assertThat(history).extracting(HistoryEntry::definitionKey, HistoryEntry::definitionVersion, HistoryEntry::state)
                .containsExactly("bpmnVerticalProcess", 1, "COMPLETED");
        assertThat(runtimeService.processHistory("client-local", execution.processInstanceId(), "worker").instanceId())
                .isEqualTo(execution.processInstanceId());
        assertThat(auditEventService.findForClient("client-local"))
                .extracting(event -> event.operation(), event -> event.outcome())
                .contains(tuple("TASK_COMPLETE", "SUCCESS"), tuple("PROCESS_START", "SUCCESS"));
    }

    @Test
    void duplicateAndFailedPublicationsPreserveTheActiveVersion() {
        PublicationEnvelope first = publication(
                "bpmnFailureProcess", BPMN_MODEL.replace("bpmnVerticalProcess", "bpmnFailureProcess"),
                "correlation-bpmn-2", "bpmn-failure-1", "client-local");
        PublicationIntakeService.IntakeResult active = publicationService.accept(first, "worker");
        PublicationIntakeService.IntakeResult duplicate = publicationService.accept(first, "worker");

        assertThat(duplicate.duplicate()).isTrue();
        assertThat(duplicate.result()).isEqualTo(active.result());

        PublicationEnvelope failedAttempt = publication(
                "bpmnFailureProcess", "<definitions><process id=\"bpmnFailureProcess\">", "correlation-bpmn-3",
                "bpmn-failure-2", "client-local");
        PublicationIntakeService.IntakeResult failed = publicationService.accept(failedAttempt, "worker");

        assertThat(failed.result().status()).isEqualTo(PublicationStatus.FAILED);
        assertThat(publicationService.activeDefinition("client-local", "bpmnFailureProcess", ModelType.BPMN, "worker")
                .runtimeReference()).isEqualTo(active.result().runtimeReference());
        assertThat(publicationRepository.findByClientIdAndModelKeyAndVersionAndIdempotencyKey(
                "client-local", "bpmnFailureProcess", 1, "bpmn-failure-1").orElseThrow().result().status())
                .isEqualTo(PublicationStatus.ACTIVE);
        assertThat(publicationRepository.findByClientIdAndModelKeyAndVersionAndIdempotencyKey(
                "client-local", "bpmnFailureProcess", 1, "bpmn-failure-2").orElseThrow().result().status())
                .isEqualTo(PublicationStatus.FAILED);
        assertThat(publicationRepository.findAllByClientIdAndActiveTrue("client-local")).filteredOn(record ->
                record.getModelKey().equals("bpmnFailureProcess")).hasSize(1);
    }

    @Test
    void runtimeInstancesCannotBeReadFromAnotherClient() {
        PublicationIntakeService.IntakeResult publication = publicationService.accept(
                publication("bpmnIsolationProcess", BPMN_MODEL.replace("bpmnVerticalProcess", "bpmnIsolationProcess"),
                        "correlation-bpmn-4", "bpmn-isolation-1", "client-local"),
                "worker");
        assertThat(publication.result().status()).isEqualTo(PublicationStatus.ACTIVE);
        ProcessExecution execution = runtimeService.startProcess(
                "client-local", "bpmnIsolationProcess", Map.of("requestType", "travel"), "worker");

        assertThatThrownBy(() -> runtimeService.processHistory(
                "other-client", execution.processInstanceId(), "worker"))
                .isInstanceOf(RuntimeAccessException.class);
    }

    @Test
    void catalogKeepsOnlyTheNewestActiveVersion() {
        PublicationEnvelope first = publication(
                "bpmnSupersededProcess", BPMN_MODEL.replace("bpmnVerticalProcess", "bpmnSupersededProcess"),
                "correlation-bpmn-5", "bpmn-superseded-1", "client-local", 1);
        PublicationEnvelope second = publication(
                "bpmnSupersededProcess", BPMN_MODEL.replace("bpmnVerticalProcess", "bpmnSupersededProcess"),
                "correlation-bpmn-6", "bpmn-superseded-2", "client-local", 2);

        assertThat(publicationService.accept(first, "worker").result().status()).isEqualTo(PublicationStatus.ACTIVE);
        assertThat(publicationService.accept(second, "worker").result().status()).isEqualTo(PublicationStatus.ACTIVE);

        assertThat(publicationService.activeDefinitions("client-local", "worker"))
                .filteredOn(definition -> definition.modelKey().equals("bpmnSupersededProcess"))
                .extracting(RuntimeDefinition::version, RuntimeDefinition::startable)
                .containsExactly(tuple(2, true));
    }

    private PublicationEnvelope publication(
            String modelKey, String xml, String correlationId, String idempotencyKey, String clientId) {
        return publication(modelKey, xml, correlationId, idempotencyKey, clientId, 1);
    }

    private PublicationEnvelope publication(
            String modelKey, String xml, String correlationId, String idempotencyKey, String clientId, int versionNumber) {
        ModelIdentity identity = new ModelIdentity(
                new ClientScope(clientId), modelKey, ModelType.BPMN, modelKey.equals("bpmnVerticalProcess")
                        ? "BPMN Vertical Process" : modelKey);
        FormSchema form = new FormSchema("1", List.of(
                new FormField("requestType", "Request type", FormFieldType.TEXT, true, null, "requestType", List.of())));
        return new PublicationEnvelope(
                identity,
                new ModelVersion(identity, versionNumber, VersionState.VALIDATED, "sha256:" + modelKey + ":" + versionNumber),
                new DocumentPayload(ModelType.BPMN, modelKey + ".bpmn20.xml", xml),
                form, idempotencyKey, correlationId, "worker");
    }
}

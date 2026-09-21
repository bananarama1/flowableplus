package com.flowableplus.work;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;

import com.flowableplus.contracts.ClientScope;
import com.flowableplus.contracts.FormField;
import com.flowableplus.contracts.FormFieldType;
import com.flowableplus.contracts.FormSchema;
import com.flowableplus.contracts.ModelType;
import com.flowableplus.contracts.RuntimeDefinition;
import com.flowableplus.flowable.adapter.FlowableRuntimeAdapter;
import com.flowableplus.flowable.adapter.HistoryEntry;
import com.flowableplus.flowable.adapter.ProcessExecution;
import com.flowableplus.flowable.adapter.TaskSummary;
import com.flowableplus.work.publication.PublicationIntakeService;
import com.flowableplus.work.runtime.RuntimeAccessException;
import com.flowableplus.work.runtime.RuntimeExecutionService;
import com.flowableplus.work.audit.AuditEventService;
import org.junit.jupiter.api.Test;

class RuntimeExecutionServiceTests {

    private final PublicationIntakeService publicationService = mock(PublicationIntakeService.class);
    private final FlowableRuntimeAdapter adapter = mock(FlowableRuntimeAdapter.class);
    private final RuntimeExecutionService service = new RuntimeExecutionService(
            publicationService, adapter, mock(AuditEventService.class));

    @Test
    void startsProcessFromActiveClientDefinition() {
        RuntimeDefinition definition = definition("client-a");
        when(publicationService.activeDefinition("client-a", "leave", ModelType.BPMN, "user-1"))
                .thenReturn(definition);
        when(adapter.startProcess("leave", Map.of("days", 3)))
                .thenReturn(new ProcessExecution("instance-1", "definition-1", "leave"));

        ProcessExecution execution = service.startProcess("client-a", "leave", Map.of("days", 3), "user-1");

        assertThat(execution.processInstanceId()).isEqualTo("instance-1");
        verify(adapter).startProcess("leave", Map.of("days", 3));
    }

    @Test
    void taskInboxFiltersTasksToTheOwningClient() {
        when(publicationService.activeDefinition("client-a", "leave", ModelType.BPMN, "user-1"))
                .thenReturn(definition("client-a"));
        when(adapter.startProcess("leave", Map.of()))
                .thenReturn(new ProcessExecution("instance-a", "definition-a", "leave"));
        service.startProcess("client-a", "leave", Map.of(), "user-1");
        when(adapter.findTasks("user-1")).thenReturn(List.of(
                new TaskSummary("task-a", "instance-a", null, "approve", "Approve", "user-1", null),
                new TaskSummary("task-b", "instance-b", null, "approve", "Approve", "user-1", null)));

        assertThat(service.tasks("client-a", "user-1")).extracting(task -> task.taskId())
                .containsExactly("task-a");
    }

    @Test
    void historyRejectsAnotherClient() {
        when(publicationService.activeDefinition("client-a", "leave", ModelType.BPMN, "user-1"))
                .thenReturn(definition("client-a"));
        when(adapter.startProcess("leave", Map.of()))
                .thenReturn(new ProcessExecution("instance-a", "definition-a", "leave"));
        service.startProcess("client-a", "leave", Map.of(), "user-1");

        assertThatThrownBy(() -> service.processHistory("client-b", "instance-a", "user-1"))
                .isInstanceOf(RuntimeAccessException.class);
    }

    @Test
    void invalidTaskSubmissionLeavesTaskActive() {
        when(publicationService.activeDefinition("client-a", "leave", ModelType.BPMN, "user-1"))
                .thenReturn(definition("client-a"));
        when(adapter.startProcess("leave", Map.of()))
                .thenReturn(new ProcessExecution("instance-a", "definition-a", "leave"));
        service.startProcess("client-a", "leave", Map.of(), "user-1");
        when(adapter.findTasks("user-1")).thenReturn(List.of(
                new TaskSummary("task-a", "instance-a", null, "approve", "Approve", "user-1", null)));
        when(publicationService.activeFormSchema("client-a", "leave", "user-1"))
                .thenReturn(new FormSchema("1", List.of(
                        new FormField("days", "Days", FormFieldType.INTEGER, true, null, "days", List.of()))));

        RuntimeExecutionService.SubmissionResult result = service.submitTask(
                "client-a", "task-a", Map.of("days", "not-an-integer"), "user-1");

        assertThat(result.errors()).extracting(error -> error.code()).containsExactly("TYPE_INVALID");
        org.mockito.Mockito.verify(adapter, org.mockito.Mockito.never())
                .completeTask(org.mockito.ArgumentMatchers.anyString(), org.mockito.ArgumentMatchers.anyMap());
    }

    @Test
    void validTaskSubmissionPersistsVariablesAndCompletesTask() {
        when(publicationService.activeDefinition("client-a", "leave", ModelType.BPMN, "user-1"))
                .thenReturn(definition("client-a"));
        when(adapter.startProcess("leave", Map.of()))
                .thenReturn(new ProcessExecution("instance-a", "definition-a", "leave"));
        service.startProcess("client-a", "leave", Map.of(), "user-1");
        when(adapter.findTasks("user-1")).thenReturn(List.of(
                new TaskSummary("task-a", "instance-a", null, "approve", "Approve", "user-1", null)));
        when(publicationService.activeFormSchema("client-a", "leave", "user-1"))
                .thenReturn(new FormSchema("1", List.of(
                        new FormField("days", "Days", FormFieldType.INTEGER, true, null, "days", List.of()))));

        RuntimeExecutionService.SubmissionResult result = service.submitTask(
                "client-a", "task-a", Map.of("days", 3), "user-1");

        assertThat(result.errors()).isEmpty();
        verify(adapter).completeTask("task-a", Map.of("days", 3));
    }

    private RuntimeDefinition definition(String clientId) {
        return new RuntimeDefinition(new ClientScope(clientId), "leave", ModelType.BPMN, 1,
                "Leave", true, "deployment-1");
    }
}
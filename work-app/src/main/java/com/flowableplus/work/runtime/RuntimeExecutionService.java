package com.flowableplus.work.runtime;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.UUID;
import java.time.Instant;
import java.time.LocalDate;

import com.flowableplus.contracts.ErrorDetail;
import com.flowableplus.contracts.FormField;
import com.flowableplus.contracts.FormSchema;
import com.flowableplus.contracts.ModelType;
import com.flowableplus.contracts.RuntimeTask;
import com.flowableplus.flowable.adapter.CaseExecution;
import com.flowableplus.flowable.adapter.FlowableRuntimeAdapter;
import com.flowableplus.flowable.adapter.HistoryEntry;
import com.flowableplus.flowable.adapter.ProcessExecution;
import com.flowableplus.flowable.adapter.TaskSummary;
import com.flowableplus.work.publication.PublicationIntakeService;
import com.flowableplus.work.audit.AuditEventService;
import org.springframework.stereotype.Service;

@Service
public class RuntimeExecutionService {

    private final PublicationIntakeService publicationService;
    private final FlowableRuntimeAdapter runtimeAdapter;
    private final AuditEventService auditEventService;
    private final Map<String, String> processClients = new ConcurrentHashMap<>();
    private final Map<String, String> processModels = new ConcurrentHashMap<>();
    private final Map<String, String> caseClients = new ConcurrentHashMap<>();
    private final Map<String, String> taskClients = new ConcurrentHashMap<>();

    public RuntimeExecutionService(
            PublicationIntakeService publicationService,
            FlowableRuntimeAdapter runtimeAdapter,
            AuditEventService auditEventService) {
        this.publicationService = publicationService;
        this.runtimeAdapter = runtimeAdapter;
        this.auditEventService = auditEventService;
    }

    public ProcessExecution startProcess(String clientId, String modelKey, Map<String, Object> variables, String actorId) {
        var definition = publicationService.activeDefinition(clientId, modelKey, ModelType.BPMN, actorId);
        ProcessExecution execution = runtimeAdapter.startProcess(definition.modelKey(), variables);
        processClients.put(execution.processInstanceId(), clientId);
        processModels.put(execution.processInstanceId(), definition.modelKey());
        auditEventService.record(actorId, clientId, execution.processInstanceId(), "PROCESS_START", "SUCCESS", UUID.randomUUID().toString());
        return execution;
    }

    public CaseExecution startCase(String clientId, String modelKey, Map<String, Object> variables, String actorId) {
        var definition = publicationService.activeDefinition(clientId, modelKey, ModelType.CMMN, actorId);
        CaseExecution execution = runtimeAdapter.startCase(definition.modelKey(), variables);
        caseClients.put(execution.caseInstanceId(), clientId);
        auditEventService.record(actorId, clientId, execution.caseInstanceId(), "CASE_START", "SUCCESS", UUID.randomUUID().toString());
        return execution;
    }

    public List<RuntimeTask> tasks(String clientId, String actorId) {
        requireActor(actorId);
        return runtimeAdapter.findTasks(actorId).stream()
                .filter(task -> clientId.equals(taskClients.computeIfAbsent(task.taskId(), ignored -> processClients.get(task.processInstanceId()))))
                .map(task -> toRuntimeTask(task, clientId))
                .toList();
    }

    public TaskDetail task(String clientId, String taskId, String actorId) {
        return tasks(clientId, actorId).stream()
                .filter(task -> task.taskId().equals(taskId))
                .findFirst()
                .map(task -> new TaskDetail(task, runtimeAdapter.getTaskVariables(taskId)))
                .orElseThrow(() -> new RuntimeAccessException("Task is not available in the requested client scope"));
    }

    public List<RuntimeTask> completeTask(String clientId, String taskId, Map<String, Object> variables, String actorId) {
        task(clientId, taskId, actorId);
        runtimeAdapter.completeTask(taskId, variables);
        auditEventService.record(actorId, clientId, taskId, "TASK_COMPLETE", "SUCCESS", UUID.randomUUID().toString());
        return tasks(clientId, actorId);
    }

    public void claimTask(String clientId, String taskId, String actorId) {
        task(clientId, taskId, actorId);
        runtimeAdapter.claimTask(taskId, actorId);
        auditEventService.record(actorId, clientId, taskId, "TASK_CLAIM", "SUCCESS", UUID.randomUUID().toString());
    }

    public FormSchema form(String clientId, String taskId, String actorId) {
        RuntimeTask runtimeTask = task(clientId, taskId, actorId).task();
        String modelKey = processModels.get(runtimeTask.processInstanceId());
        return modelKey == null ? null : publicationService.activeFormSchema(clientId, modelKey, actorId);
    }

    public SubmissionResult submitTask(
            String clientId, String taskId, Map<String, Object> variables, String actorId) {
        FormSchema schema = form(clientId, taskId, actorId);
        List<ErrorDetail> errors = validate(schema, variables);
        if (!errors.isEmpty()) {
            return new SubmissionResult(errors, List.of());
        }
        return new SubmissionResult(List.of(), completeTask(clientId, taskId, variables, actorId));
    }

    private List<ErrorDetail> validate(FormSchema schema, Map<String, Object> variables) {
        if (schema == null) {
            return List.of();
        }
        List<ErrorDetail> errors = new java.util.ArrayList<>();
        for (FormField field : schema.fields()) {
            Object value = variables.get(field.variableName());
            if (field.required() && (value == null || value.toString().isBlank())) {
                errors.add(new ErrorDetail(field.id(), "REQUIRED", "A value is required"));
                continue;
            }
            if (value != null && !validType(field, value)) {
                errors.add(new ErrorDetail(field.id(), "TYPE_INVALID", "The submitted value has the wrong type"));
            }
        }
        return List.copyOf(errors);
    }

    private boolean validType(FormField field, Object value) {
        try {
            return switch (field.type()) {
                case TEXT, TEXTAREA -> value instanceof String;
                case INTEGER -> value instanceof Integer || value instanceof Long;
                case DECIMAL -> value instanceof Number;
                case BOOLEAN -> value instanceof Boolean;
                case DATE -> { LocalDate.parse(value.toString()); yield true; }
                case DATE_TIME -> { Instant.parse(value.toString()); yield true; }
                case SELECT -> field.options() != null && field.options().contains(value.toString());
            };
        } catch (RuntimeException exception) {
            return false;
        }
    }

    public HistoryEntry processHistory(String clientId, String instanceId, String actorId) {
        requireOwner(processClients, clientId, instanceId, actorId);
        return runtimeAdapter.findProcessHistory(instanceId);
    }

    public HistoryEntry caseHistory(String clientId, String instanceId, String actorId) {
        requireOwner(caseClients, clientId, instanceId, actorId);
        return runtimeAdapter.findCaseHistory(instanceId);
    }

    private RuntimeTask toRuntimeTask(TaskSummary task, String clientId) {
        return new RuntimeTask(task.taskId(), new com.flowableplus.contracts.ClientScope(clientId),
                task.processInstanceId(), task.caseInstanceId(), task.taskDefinitionKey(), task.name(),
            task.assignee(), task.dueAt(), task.processInstanceId() == null ? null : processModels.get(task.processInstanceId()));
    }

    private void requireOwner(Map<String, String> owners, String clientId, String instanceId, String actorId) {
        requireActor(actorId);
        if (!clientId.equals(owners.get(instanceId))) {
            throw new RuntimeAccessException("Runtime instance is not available in the requested client scope");
        }
    }

    private void requireActor(String actorId) {
        if (actorId == null || actorId.isBlank()) {
            throw new RuntimeAuthenticationException();
        }
    }

    public record TaskDetail(RuntimeTask task, Map<String, Object> variables) {
    }

    public record SubmissionResult(List<ErrorDetail> errors, List<RuntimeTask> nextTasks) {
    }
}
package com.flowableplus.flowable.adapter;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import com.flowableplus.contracts.DocumentPayload;
import org.flowable.cmmn.api.CmmnHistoryService;
import org.flowable.cmmn.api.CmmnRepositoryService;
import org.flowable.cmmn.api.CmmnRuntimeService;
import org.flowable.cmmn.api.history.HistoricCaseInstance;
import org.flowable.cmmn.api.repository.CmmnDeployment;
import org.flowable.cmmn.api.repository.CaseDefinition;
import org.flowable.cmmn.api.runtime.CaseInstance;
import org.flowable.engine.HistoryService;
import org.flowable.engine.RepositoryService;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.flowable.engine.history.HistoricProcessInstance;
import org.flowable.engine.repository.Deployment;
import org.flowable.engine.repository.ProcessDefinition;
import org.flowable.task.api.Task;

public class DefaultFlowableRuntimeAdapter implements FlowableRuntimeAdapter {

    private final RepositoryService repositoryService;
    private final CmmnRepositoryService cmmnRepositoryService;
    private final RuntimeService runtimeService;
    private final CmmnRuntimeService cmmnRuntimeService;
    private final TaskService taskService;
    private final HistoryService historyService;
    private final CmmnHistoryService cmmnHistoryService;

    public DefaultFlowableRuntimeAdapter(
            RepositoryService repositoryService,
            CmmnRepositoryService cmmnRepositoryService,
            RuntimeService runtimeService,
            CmmnRuntimeService cmmnRuntimeService,
            TaskService taskService,
            HistoryService historyService,
            CmmnHistoryService cmmnHistoryService) {
        this.repositoryService = repositoryService;
        this.cmmnRepositoryService = cmmnRepositoryService;
        this.runtimeService = runtimeService;
        this.cmmnRuntimeService = cmmnRuntimeService;
        this.taskService = taskService;
        this.historyService = historyService;
        this.cmmnHistoryService = cmmnHistoryService;
    }

    @Override
    public DeploymentReference deployBpmn(DocumentPayload document) {
        Deployment deployment = repositoryService.createDeployment()
                .addString(document.fileName(), document.xml())
                .deploy();
        ProcessDefinition definition = repositoryService.createProcessDefinitionQuery()
                .deploymentId(deployment.getId())
                .singleResult();
        return new DeploymentReference(deployment.getId(), definition.getId(), definition.getKey());
    }

    @Override
    public DeploymentReference deployCmmn(DocumentPayload document) {
        CmmnDeployment deployment = cmmnRepositoryService.createDeployment()
                .addString(document.fileName(), document.xml())
                .deploy();
        CaseDefinition definition = cmmnRepositoryService.createCaseDefinitionQuery()
                .deploymentId(deployment.getId())
                .singleResult();
        return new DeploymentReference(deployment.getId(), definition.getId(), definition.getKey());
    }

    @Override
    public ProcessExecution startProcess(String definitionKey, Map<String, Object> variables) {
        org.flowable.engine.runtime.ProcessInstance instance = runtimeService
                .startProcessInstanceByKey(definitionKey, variables);
        return new ProcessExecution(instance.getProcessInstanceId(), instance.getProcessDefinitionId(), definitionKey);
    }

    @Override
    public CaseExecution startCase(String definitionKey, Map<String, Object> variables) {
        CaseInstance instance = cmmnRuntimeService.createCaseInstanceBuilder()
                .caseDefinitionKey(definitionKey)
                .variables(variables)
                .start();
        return new CaseExecution(instance.getId(), instance.getCaseDefinitionId(), definitionKey);
    }

    @Override
    public List<TaskSummary> findTasks(String assignee) {
        return taskService.createTaskQuery().taskAssignee(assignee).list().stream()
                .map(this::toTaskSummary)
                .toList();
    }

    @Override
    public Map<String, Object> getTaskVariables(String taskId) {
        return taskService.getVariables(taskId);
    }

    @Override
    public void claimTask(String taskId, String assignee) {
        taskService.claim(taskId, assignee);
    }

    @Override
    public void completeTask(String taskId, Map<String, Object> variables) {
        taskService.complete(taskId, variables);
    }

    @Override
    public HistoryEntry findProcessHistory(String processInstanceId) {
        HistoricProcessInstance history = historyService.createHistoricProcessInstanceQuery()
                .processInstanceId(processInstanceId)
                .singleResult();
        int version = repositoryService.createProcessDefinitionQuery()
            .processDefinitionId(history.getProcessDefinitionId()).singleResult().getVersion();
        return new HistoryEntry(history.getId(), history.getProcessDefinitionKey(), version,
            history.getEndTime() == null ? "ACTIVE" : "COMPLETED",
                toInstant(history.getStartTime()), toInstant(history.getEndTime()));
    }

    @Override
    public HistoryEntry findCaseHistory(String caseInstanceId) {
        HistoricCaseInstance history = cmmnHistoryService.createHistoricCaseInstanceQuery()
                .caseInstanceId(caseInstanceId)
                .singleResult();
        int version = cmmnRepositoryService.createCaseDefinitionQuery()
            .caseDefinitionId(history.getCaseDefinitionId()).singleResult().getVersion();
        return new HistoryEntry(history.getId(), history.getCaseDefinitionKey(), version,
            history.getEndTime() == null ? "ACTIVE" : "COMPLETED",
                toInstant(history.getStartTime()), toInstant(history.getEndTime()));
    }

    private TaskSummary toTaskSummary(Task task) {
        return new TaskSummary(task.getId(), task.getProcessInstanceId(), null,
                task.getTaskDefinitionKey(), task.getName(), task.getAssignee(), toInstant(task.getDueDate()));
    }

    private Instant toInstant(java.util.Date date) {
        return date == null ? null : date.toInstant();
    }
}
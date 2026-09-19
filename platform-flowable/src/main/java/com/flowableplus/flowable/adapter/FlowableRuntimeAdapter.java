package com.flowableplus.flowable.adapter;

import java.util.List;
import java.util.Map;

import com.flowableplus.contracts.DocumentPayload;

public interface FlowableRuntimeAdapter {

    DeploymentReference deployBpmn(DocumentPayload document);

    DeploymentReference deployCmmn(DocumentPayload document);

    ProcessExecution startProcess(String definitionKey, Map<String, Object> variables);

    CaseExecution startCase(String definitionKey, Map<String, Object> variables);

    List<TaskSummary> findTasks(String assignee);

    Map<String, Object> getTaskVariables(String taskId);

    void completeTask(String taskId, Map<String, Object> variables);

    HistoryEntry findProcessHistory(String processInstanceId);

    HistoryEntry findCaseHistory(String caseInstanceId);
}
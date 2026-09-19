package com.flowableplus.flowable.adapter;

import java.time.Instant;

public record TaskSummary(
        String taskId,
        String processInstanceId,
        String caseInstanceId,
        String taskDefinitionKey,
        String name,
        String assignee,
        Instant dueAt) {
}
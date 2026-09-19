package com.flowableplus.contracts;

import java.time.Instant;

public record RuntimeTask(
        String taskId,
        ClientScope clientScope,
        String processInstanceId,
        String caseInstanceId,
        String taskDefinitionKey,
        String name,
        String assignee,
        Instant dueAt,
        String formSchemaId) {
}
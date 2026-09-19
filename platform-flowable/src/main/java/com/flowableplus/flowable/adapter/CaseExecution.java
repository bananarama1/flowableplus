package com.flowableplus.flowable.adapter;

public record CaseExecution(
        String caseInstanceId,
        String caseDefinitionId,
        String caseDefinitionKey) {
}
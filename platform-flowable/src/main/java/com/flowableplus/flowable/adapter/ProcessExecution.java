package com.flowableplus.flowable.adapter;

public record ProcessExecution(
        String processInstanceId,
        String processDefinitionId,
        String processDefinitionKey) {
}
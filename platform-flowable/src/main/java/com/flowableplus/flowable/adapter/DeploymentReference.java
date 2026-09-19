package com.flowableplus.flowable.adapter;

public record DeploymentReference(
        String deploymentId,
        String definitionId,
        String definitionKey) {
}
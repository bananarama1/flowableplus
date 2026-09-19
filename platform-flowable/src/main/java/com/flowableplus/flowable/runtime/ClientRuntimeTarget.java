package com.flowableplus.flowable.runtime;

public record ClientRuntimeTarget(
        String clientId,
        String runtimeId,
        String databaseSchema,
        String publicationBaseUrl) {
}
package com.flowableplus.flowable.runtime;

public record RuntimeProvisioningRequest(
        String clientId,
        String runtimeId,
        String databaseSchema,
        String publicationBaseUrl) {
}
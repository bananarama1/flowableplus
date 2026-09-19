package com.flowableplus.contracts;

public record PublicationResult(
        PublicationStatus status,
        String correlationId,
        String runtimeReference,
        String failureCode,
        String failureMessage) {
}
package com.flowableplus.contracts;

public record PublicationEnvelope(
        ModelIdentity model,
        ModelVersion version,
        DocumentPayload document,
        FormSchema formSchema,
        String idempotencyKey,
        String correlationId,
        String actorId) {
}
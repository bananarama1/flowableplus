package com.flowableplus.contracts;

import java.util.ArrayList;
import java.util.List;

public final class PublicationContract {

    public static final String API_VERSION_HEADER = "X-FlowablePlus-Api-Version";
    public static final String CORRELATION_ID_HEADER = "X-Correlation-Id";
    public static final String IDEMPOTENCY_KEY_HEADER = "Idempotency-Key";
    public static final String CURRENT_API_VERSION = "1";

    private PublicationContract() {
    }

    public static List<StructuredError> validate(PublicationEnvelope envelope) {
        List<StructuredError> errors = new ArrayList<>();
        if (envelope == null) {
            return List.of(error("PUBLICATION_REQUIRED", "Publication envelope is required", null));
        }
        if (envelope.model() == null) {
            errors.add(error("MODEL_REQUIRED", "Model identity is required", envelope.correlationId()));
        } else {
            if (envelope.model().clientScope() == null || isBlank(envelope.model().clientScope().clientId())) {
                errors.add(error("CLIENT_SCOPE_REQUIRED", "Client scope is required", envelope.correlationId()));
            }
            if (isBlank(envelope.model().modelKey()) || envelope.model().modelType() == null) {
                errors.add(error("MODEL_IDENTITY_INVALID", "Model key and model type are required", envelope.correlationId()));
            }
        }
        if (envelope.version() == null) {
            errors.add(error("VERSION_REQUIRED", "Model version is required", envelope.correlationId()));
        } else if (envelope.version().version() < 1 || isBlank(envelope.version().contentHash())) {
            errors.add(error("VERSION_INVALID", "A positive model version and content hash are required", envelope.correlationId()));
        }
        if (envelope.document() == null) {
            errors.add(error("DOCUMENT_REQUIRED", "Document payload is required", envelope.correlationId()));
        } else if (envelope.document().modelType() == null
                || isBlank(envelope.document().fileName())
                || isBlank(envelope.document().xml())) {
            errors.add(error("DOCUMENT_INVALID", "Document type, file name, and XML are required", envelope.correlationId()));
        }
        if (isBlank(envelope.idempotencyKey())) {
            errors.add(error("IDEMPOTENCY_KEY_REQUIRED", "Idempotency key is required", envelope.correlationId()));
        }
        if (isBlank(envelope.correlationId())) {
            errors.add(error("CORRELATION_ID_REQUIRED", "Correlation id is required", null));
        }
        if (isBlank(envelope.actorId())) {
            errors.add(error("ACTOR_ID_REQUIRED", "Publication actor is required", envelope.correlationId()));
        }
        if (envelope.model() != null && envelope.version() != null
                && !envelope.model().equals(envelope.version().model())) {
            errors.add(error("MODEL_VERSION_MISMATCH", "Model identity does not match version identity", envelope.correlationId()));
        }
        if (envelope.model() != null && envelope.document() != null
                && envelope.model().modelType() != envelope.document().modelType()) {
            errors.add(error("DOCUMENT_TYPE_MISMATCH", "Document type does not match model type", envelope.correlationId()));
        }
        return List.copyOf(errors);
    }

    public static List<StructuredError> validateHeaders(
            PublicationEnvelope envelope, String apiVersion, String correlationId, String idempotencyKey) {
        List<StructuredError> errors = new ArrayList<>();
        if (isBlank(apiVersion)) {
            errors.add(error("API_VERSION_REQUIRED", "The publication API version header is required", correlationId));
        } else if (!CURRENT_API_VERSION.equals(apiVersion)) {
            errors.add(error("API_VERSION_UNSUPPORTED", "The publication API version is not supported", correlationId));
        }
        if (isBlank(correlationId)) {
            errors.add(error("CORRELATION_ID_HEADER_REQUIRED", "The correlation header is required", null));
        } else if (envelope != null
                && !isBlank(envelope.correlationId()) && !correlationId.equals(envelope.correlationId())) {
            errors.add(error("CORRELATION_ID_MISMATCH", "Correlation header does not match the publication envelope", correlationId));
        }
        if (isBlank(idempotencyKey)) {
            errors.add(error("IDEMPOTENCY_KEY_HEADER_REQUIRED", "The idempotency header is required", correlationId));
        } else if (envelope != null
                && !isBlank(envelope.idempotencyKey()) && !idempotencyKey.equals(envelope.idempotencyKey())) {
            errors.add(error("IDEMPOTENCY_KEY_MISMATCH", "Idempotency header does not match the publication envelope", correlationId));
        }
        return List.copyOf(errors);
    }

    private static StructuredError error(String code, String message, String correlationId) {
        return new StructuredError(code, message, correlationId, List.of());
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
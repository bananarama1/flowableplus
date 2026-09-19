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
        }
        if (envelope.version() == null) {
            errors.add(error("VERSION_REQUIRED", "Model version is required", envelope.correlationId()));
        }
        if (envelope.document() == null) {
            errors.add(error("DOCUMENT_REQUIRED", "Document payload is required", envelope.correlationId()));
        }
        if (isBlank(envelope.idempotencyKey())) {
            errors.add(error("IDEMPOTENCY_KEY_REQUIRED", "Idempotency key is required", envelope.correlationId()));
        }
        if (isBlank(envelope.correlationId())) {
            errors.add(error("CORRELATION_ID_REQUIRED", "Correlation id is required", null));
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

    private static StructuredError error(String code, String message, String correlationId) {
        return new StructuredError(code, message, correlationId, List.of());
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
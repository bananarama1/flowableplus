package com.flowableplus.contracts;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;

class PublicationContractTests {

    @Test
    void malformedPublicationReturnsStructuredErrors() {
        List<StructuredError> errors = PublicationContract.validate(
                new PublicationEnvelope(null, null, null, null, "", "correlation-1", "user-1"));

        assertThat(errors).extracting(StructuredError::code)
                .containsExactly("MODEL_REQUIRED", "VERSION_REQUIRED", "DOCUMENT_REQUIRED", "IDEMPOTENCY_KEY_REQUIRED");
    }

    @Test
    void duplicateRequestsUseStableRetryHeaders() {
        assertThat(PublicationContract.API_VERSION_HEADER).isEqualTo("X-FlowablePlus-Api-Version");
        assertThat(PublicationContract.CORRELATION_ID_HEADER).isEqualTo("X-Correlation-Id");
        assertThat(PublicationContract.IDEMPOTENCY_KEY_HEADER).isEqualTo("Idempotency-Key");

        PublicationEnvelope first = publication("correlation-1", "client-a:leave-request:3");
        PublicationEnvelope retry = publication("correlation-1", "client-a:leave-request:3");

        assertThat(retry.idempotencyKey()).isEqualTo(first.idempotencyKey());
        assertThat(retry.correlationId()).isEqualTo(first.correlationId());
    }

    @Test
    void rejectsIncompleteNestedPublicationIdentity() {
        PublicationEnvelope envelope = new PublicationEnvelope(
                new ModelIdentity(null, "leave-request", ModelType.BPMN, "Leave request"),
                new ModelVersion(null, 0, VersionState.VALIDATED, ""),
                new DocumentPayload(ModelType.BPMN, "", ""),
                null, "retry-1", "correlation-1", "user-1");

        assertThat(PublicationContract.validate(envelope)).extracting(StructuredError::code)
                .containsExactly("CLIENT_SCOPE_REQUIRED", "VERSION_INVALID", "DOCUMENT_INVALID", "MODEL_VERSION_MISMATCH");
    }

    @Test
    void rejectsMismatchedTransportHeaders() {
        assertThat(PublicationContract.validateHeaders(
                publication("correlation-1", "retry-1"), "2", "correlation-2", "retry-2"))
                .extracting(StructuredError::code)
                .containsExactly("API_VERSION_UNSUPPORTED", "CORRELATION_ID_MISMATCH", "IDEMPOTENCY_KEY_MISMATCH");
    }

    private PublicationEnvelope publication(String correlationId, String idempotencyKey) {
        ClientScope client = new ClientScope("client-a");
        ModelIdentity identity = new ModelIdentity(client, "leave-request", ModelType.BPMN, "Leave request");
        ModelVersion version = new ModelVersion(identity, 3, VersionState.VALIDATED, "sha256:abc");
        return new PublicationEnvelope(
                identity,
                version,
                new DocumentPayload(ModelType.BPMN, "leave-request.bpmn20.xml", "<definitions />"),
                null,
                idempotencyKey,
                correlationId,
                "user-1");
    }
}
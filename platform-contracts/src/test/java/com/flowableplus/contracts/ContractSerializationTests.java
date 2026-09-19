package com.flowableplus.contracts;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.Test;

class ContractSerializationTests {

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @Test
    void publicationEnvelopeRoundTripsThroughJson() throws Exception {
        ClientScope client = new ClientScope("client-a");
        ModelIdentity identity = new ModelIdentity(client, "leave-request", ModelType.BPMN, "Leave request");
        ModelVersion version = new ModelVersion(identity, 3, VersionState.VALIDATED, "sha256:abc");
        FormSchema form = new FormSchema("1", List.of(
                new FormField("days", "Days", FormFieldType.INTEGER, true, 1, "leaveDays", List.of())));
        PublicationEnvelope source = new PublicationEnvelope(
                identity,
                version,
                new DocumentPayload(ModelType.BPMN, "leave-request.bpmn20.xml", "<definitions />"),
                form,
                "client-a:leave-request:3",
                "correlation-123",
                "user-1");

        PublicationEnvelope result = objectMapper.readValue(
                objectMapper.writeValueAsString(source), PublicationEnvelope.class);

        assertThat(result).isEqualTo(source);
    }

    @Test
    void runtimeTaskPreservesInstantAndClientScope() throws Exception {
        RuntimeTask source = new RuntimeTask(
                "task-1", new ClientScope("client-a"), "process-1", null,
                "approve", "Approve request", "user-1", Instant.parse("2026-09-19T12:00:00Z"), "form-1");

        RuntimeTask result = objectMapper.readValue(
                objectMapper.writeValueAsString(source), RuntimeTask.class);

        assertThat(result).isEqualTo(source);
    }
}
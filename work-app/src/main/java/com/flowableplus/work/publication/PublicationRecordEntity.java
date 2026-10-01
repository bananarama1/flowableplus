package com.flowableplus.work.publication;

import java.time.Instant;
import java.util.UUID;

import com.flowableplus.contracts.FormSchema;
import com.flowableplus.contracts.ModelType;
import com.flowableplus.contracts.PublicationResult;
import com.flowableplus.contracts.PublicationStatus;
import com.flowableplus.contracts.RuntimeDefinition;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "publication_record", uniqueConstraints = @UniqueConstraint(
        name = "uk_publication_record_idempotency",
        columnNames = { "client_id", "model_key", "version", "idempotency_key" }))
public class PublicationRecordEntity {

    @Id
    private String id;
    @Column(name = "client_id", nullable = false)
    private String clientId;
    @Column(name = "model_key", nullable = false)
    private String modelKey;
    @Enumerated(EnumType.STRING)
    @Column(name = "model_type", nullable = false)
    private ModelType modelType;
    @Column(nullable = false)
    private int version;
    @Column(name = "display_name", nullable = false)
    private String displayName;
    @Column(name = "idempotency_key", nullable = false)
    private String idempotencyKey;
    @Column(name = "correlation_id")
    private String correlationId;
    @Column(name = "actor_id")
    private String actorId;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PublicationStatus status;
    @Column(name = "runtime_reference")
    private String runtimeReference;
    @Column(name = "failure_code")
    private String failureCode;
    @Column(name = "failure_message")
    private String failureMessage;
    @Column(nullable = false)
    private boolean active;
    @Column(name = "form_schema_json", columnDefinition = "clob")
    private String formSchemaJson;
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected PublicationRecordEntity() {
    }

    private PublicationRecordEntity(String clientId, String modelKey, ModelType modelType, int version,
            String displayName, String idempotencyKey, String correlationId, String actorId,
            PublicationResult result, String formSchemaJson) {
        this.id = UUID.randomUUID().toString();
        this.clientId = clientId;
        this.modelKey = modelKey;
        this.modelType = modelType;
        this.version = version;
        this.displayName = displayName;
        this.idempotencyKey = idempotencyKey;
        this.correlationId = correlationId;
        this.actorId = actorId;
        this.status = result.status();
        this.runtimeReference = result.runtimeReference();
        this.failureCode = result.failureCode();
        this.failureMessage = result.failureMessage();
        this.active = result.status() == PublicationStatus.ACTIVE;
        this.formSchemaJson = formSchemaJson;
        this.createdAt = Instant.now();
    }

    public static PublicationRecordEntity from(String clientId, String modelKey, ModelType modelType, int version,
            String displayName, String idempotencyKey, String correlationId, String actorId,
            PublicationResult result, FormSchema formSchema, ObjectMapper objectMapper) {
        return new PublicationRecordEntity(clientId, modelKey, modelType, version, displayName,
                idempotencyKey, correlationId, actorId, result, serialize(formSchema, objectMapper));
    }

    public PublicationResult result() {
        return new PublicationResult(status, correlationId, runtimeReference, failureCode, failureMessage);
    }

    public RuntimeDefinition definition() {
        return new RuntimeDefinition(new com.flowableplus.contracts.ClientScope(clientId), modelKey,
                modelType, version, displayName, active, runtimeReference);
    }

    public FormSchema formSchema(ObjectMapper objectMapper) {
        if (formSchemaJson == null) {
            return null;
        }
        try {
            return objectMapper.readValue(formSchemaJson, FormSchema.class);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Stored publication form schema is invalid", exception);
        }
    }

    public void deactivate() {
        this.active = false;
    }

    public String getClientId() { return clientId; }
    public String getModelKey() { return modelKey; }
    public boolean isActive() { return active; }
    public String getIdempotencyKey() { return idempotencyKey; }

    private static String serialize(FormSchema formSchema, ObjectMapper objectMapper) {
        if (formSchema == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(formSchema);
        } catch (JsonProcessingException exception) {
            throw new IllegalArgumentException("Publication form schema could not be stored", exception);
        }
    }
}
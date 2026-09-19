package com.flowableplus.modeler.publication;

import java.time.Instant;
import java.util.UUID;

import com.flowableplus.contracts.PublicationStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "publication_record")
public class PublicationRecordEntity {

    @Id
    private String id;
    private String clientId;
    private String modelKey;
    private String versionId;
    private String actorId;
    private Instant createdAt;
    @Enumerated(EnumType.STRING)
    private PublicationStatus status;
    private String runtimeReference;
    private String failureDetails;
    private String correlationId;
    private boolean active;

    protected PublicationRecordEntity() {
    }

    public PublicationRecordEntity(
            String clientId,
            String modelKey,
            String versionId,
            String actorId,
            PublicationStatus status,
            String runtimeReference,
            String failureDetails,
            String correlationId,
            boolean active) {
        this.id = UUID.randomUUID().toString();
        this.clientId = clientId;
        this.modelKey = modelKey;
        this.versionId = versionId;
        this.actorId = actorId;
        this.createdAt = Instant.now();
        this.status = status;
        this.runtimeReference = runtimeReference;
        this.failureDetails = failureDetails;
        this.correlationId = correlationId;
        this.active = active;
    }

    public String getId() {
        return id;
    }

    public String getVersionId() {
        return versionId;
    }

    public PublicationStatus getStatus() {
        return status;
    }

    public String getRuntimeReference() {
        return runtimeReference;
    }

    public String getFailureDetails() {
        return failureDetails;
    }

    public String getCorrelationId() {
        return correlationId;
    }

    public boolean isActive() {
        return active;
    }

    public void deactivate() {
        this.active = false;
    }
}
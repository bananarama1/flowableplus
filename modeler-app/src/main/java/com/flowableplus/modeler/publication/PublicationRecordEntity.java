package com.flowableplus.modeler.publication;

import java.time.Instant;
import java.util.UUID;

import com.flowableplus.contracts.PublicationStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "publication_record")
public class PublicationRecordEntity {

    @Id
    private String id;
    @Column(nullable = false)
    private String clientId;
    @Column(nullable = false)
    private String modelKey;
    @Column(nullable = false)
    private String versionId;
    @Column(nullable = false)
    private String actorId;
    @Column(nullable = false)
    private Instant createdAt;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PublicationStatus status;
    private String runtimeReference;
    private String failureDetails;
    @Column(nullable = false)
    private String correlationId;
    @Column(nullable = false)
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
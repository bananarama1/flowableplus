package com.flowableplus.modeler.model;

import java.time.Instant;
import java.util.UUID;

import com.flowableplus.contracts.ModelType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "model_project")
public class ModelProjectEntity {

    @Id
    private String id;
    @Column(nullable = false)
    private String clientId;
    @Column(nullable = false)
    private String modelKey;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ModelType modelType;
    @Column(nullable = false)
    private String displayName;
    @Column(nullable = false)
    private String ownerId;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ModelLifecycleState lifecycleState;
    @Column(nullable = false)
    private Instant createdAt;

    protected ModelProjectEntity() {
    }

    public ModelProjectEntity(String clientId, String modelKey, ModelType modelType, String displayName, String ownerId) {
        this.id = UUID.randomUUID().toString();
        this.clientId = clientId;
        this.modelKey = modelKey;
        this.modelType = modelType;
        this.displayName = displayName;
        this.ownerId = ownerId;
        this.lifecycleState = ModelLifecycleState.DRAFT;
        this.createdAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public String getClientId() {
        return clientId;
    }

    public String getModelKey() {
        return modelKey;
    }

    public ModelType getModelType() {
        return modelType;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public ModelLifecycleState getLifecycleState() {
        return lifecycleState;
    }
}
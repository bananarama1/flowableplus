package com.flowableplus.modeler.model;

import java.time.Instant;
import java.util.UUID;

import com.flowableplus.contracts.ModelType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "model_project")
public class ModelProjectEntity {

    @Id
    private String id;
    private String clientId;
    private String modelKey;
    @Enumerated(EnumType.STRING)
    private ModelType modelType;
    private String displayName;
    private String ownerId;
    @Enumerated(EnumType.STRING)
    private ModelLifecycleState lifecycleState;
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
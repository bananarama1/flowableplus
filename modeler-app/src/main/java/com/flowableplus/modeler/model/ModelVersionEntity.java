package com.flowableplus.modeler.model;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "model_version")
public class ModelVersionEntity {

    @Id
    private String id;
    private String clientId;
    private String projectId;
    private int versionNumber;
    private String xml;
    @Enumerated(EnumType.STRING)
    private VersionLifecycleState state;
    private Instant createdAt;

    protected ModelVersionEntity() {
    }

    public ModelVersionEntity(String clientId, String projectId, int versionNumber, String xml) {
        this.id = UUID.randomUUID().toString();
        this.clientId = clientId;
        this.projectId = projectId;
        this.versionNumber = versionNumber;
        this.xml = xml;
        this.state = VersionLifecycleState.DRAFT;
        this.createdAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public String getClientId() {
        return clientId;
    }

    public String getProjectId() {
        return projectId;
    }

    public int getVersionNumber() {
        return versionNumber;
    }

    public String getXml() {
        return xml;
    }

    public VersionLifecycleState getState() {
        return state;
    }

    public void updateDraft(String xml) {
        if (state != VersionLifecycleState.DRAFT) {
            throw new PublishedVersionMutationException(id);
        }
        this.xml = xml;
    }

    public void publish() {
        if (state != VersionLifecycleState.DRAFT) {
            throw new PublishedVersionMutationException(id);
        }
        this.state = VersionLifecycleState.PUBLISHED;
    }
}
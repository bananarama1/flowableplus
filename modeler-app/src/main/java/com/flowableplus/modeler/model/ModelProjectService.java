package com.flowableplus.modeler.model;

import java.util.List;

import com.flowableplus.contracts.ModelType;
import org.springframework.stereotype.Service;
import com.flowableplus.modeler.audit.AuditEventService;
import java.util.UUID;

@Service
public class ModelProjectService {

    private final ModelProjectRepository repository;
    private final AuditEventService auditEventService;

    public ModelProjectService(ModelProjectRepository repository, AuditEventService auditEventService) {
        this.repository = repository;
        this.auditEventService = auditEventService;
    }

    public ModelProjectEntity create(String clientId, String modelKey, ModelType modelType, String displayName, String ownerId) {
        ModelProjectEntity project = repository.save(new ModelProjectEntity(clientId, modelKey, modelType, displayName, ownerId));
        auditEventService.record(ownerId, clientId, project.getId(), "MODEL_CREATE", "SUCCESS", UUID.randomUUID().toString());
        return project;
    }

    public List<ModelProjectEntity> findForClient(String clientId) {
        return repository.findAllByClientId(clientId);
    }

    public ModelProjectEntity findAuthorized(String clientId, String projectId) {
        return repository.findByIdAndClientId(projectId, clientId).orElseThrow();
    }
}
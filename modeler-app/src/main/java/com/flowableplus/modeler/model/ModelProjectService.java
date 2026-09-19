package com.flowableplus.modeler.model;

import java.util.List;

import com.flowableplus.contracts.ModelType;
import org.springframework.stereotype.Service;

@Service
public class ModelProjectService {

    private final ModelProjectRepository repository;

    public ModelProjectService(ModelProjectRepository repository) {
        this.repository = repository;
    }

    public ModelProjectEntity create(String clientId, String modelKey, ModelType modelType, String displayName, String ownerId) {
        return repository.save(new ModelProjectEntity(clientId, modelKey, modelType, displayName, ownerId));
    }

    public List<ModelProjectEntity> findForClient(String clientId) {
        return repository.findAllByClientId(clientId);
    }

    public ModelProjectEntity findAuthorized(String clientId, String projectId) {
        return repository.findByIdAndClientId(projectId, clientId).orElseThrow();
    }
}
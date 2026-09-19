package com.flowableplus.modeler.model;

import com.flowableplus.contracts.ModelType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ModelVersionService {

    private final ModelProjectRepository projectRepository;
    private final ModelVersionRepository versionRepository;

    public ModelVersionService(ModelProjectRepository projectRepository, ModelVersionRepository versionRepository) {
        this.projectRepository = projectRepository;
        this.versionRepository = versionRepository;
    }

    @Transactional
    public ModelVersionEntity saveDraft(String clientId, String projectId, String xml) {
        projectRepository.findByIdAndClientId(projectId, clientId).orElseThrow();
        int nextVersion = versionRepository.findAllByProjectIdOrderByVersionNumberDesc(projectId).stream()
                .mapToInt(ModelVersionEntity::getVersionNumber)
                .max()
                .orElse(0) + 1;
        return versionRepository.save(new ModelVersionEntity(clientId, projectId, nextVersion, xml));
    }

    @Transactional
    public ModelVersionEntity updateDraft(String clientId, String versionId, String xml) {
        ModelVersionEntity version = versionRepository.findByIdAndClientId(versionId, clientId).orElseThrow();
        version.updateDraft(xml);
        return versionRepository.save(version);
    }

    @Transactional
    public ModelVersionEntity publish(String clientId, String versionId) {
        ModelVersionEntity version = versionRepository.findByIdAndClientId(versionId, clientId).orElseThrow();
        version.publish();
        return versionRepository.save(version);
    }

    @Transactional
    public ModelVersionEntity createDraftFromPublished(String clientId, String versionId) {
        ModelVersionEntity published = versionRepository.findByIdAndClientId(versionId, clientId).orElseThrow();
        if (published.getState() != VersionLifecycleState.PUBLISHED) {
            throw new IllegalStateException("Only a published version can seed a new draft");
        }
        return saveDraft(clientId, published.getProjectId(), published.getXml());
    }
}
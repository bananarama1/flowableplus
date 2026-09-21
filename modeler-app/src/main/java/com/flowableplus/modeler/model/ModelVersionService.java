package com.flowableplus.modeler.model;

import com.flowableplus.contracts.ModelType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;
import com.flowableplus.modeler.audit.AuditEventService;

@Service
public class ModelVersionService {

    private final ModelProjectRepository projectRepository;
    private final ModelVersionRepository versionRepository;
        private final AuditEventService auditEventService;

        public ModelVersionService(ModelProjectRepository projectRepository, ModelVersionRepository versionRepository,
            AuditEventService auditEventService) {
        this.projectRepository = projectRepository;
        this.versionRepository = versionRepository;
        this.auditEventService = auditEventService;
    }

    @Transactional
    public ModelVersionEntity saveDraft(String clientId, String projectId, String xml) {
        projectRepository.findByIdAndClientId(projectId, clientId).orElseThrow();
        int nextVersion = versionRepository.findAllByProjectIdOrderByVersionNumberDesc(projectId).stream()
                .mapToInt(ModelVersionEntity::getVersionNumber)
                .max()
                .orElse(0) + 1;
        ModelVersionEntity draft = versionRepository.save(new ModelVersionEntity(clientId, projectId, nextVersion, xml));
        auditEventService.record(null, clientId, draft.getId(), "MODEL_DRAFT_SAVE", "SUCCESS", UUID.randomUUID().toString());
        return draft;
    }

    @Transactional
    public ModelVersionEntity updateDraft(String clientId, String versionId, String xml) {
        ModelVersionEntity version = versionRepository.findByIdAndClientId(versionId, clientId).orElseThrow();
        version.updateDraft(xml);
        auditEventService.record(null, clientId, versionId, "MODEL_EDIT", "SUCCESS", UUID.randomUUID().toString());
        return versionRepository.save(version);
    }

    @Transactional
    public ModelVersionEntity publish(String clientId, String versionId) {
        ModelVersionEntity version = versionRepository.findByIdAndClientId(versionId, clientId).orElseThrow();
        version.publish();
        auditEventService.record(null, clientId, versionId, "MODEL_PUBLISH", "SUCCESS", UUID.randomUUID().toString());
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
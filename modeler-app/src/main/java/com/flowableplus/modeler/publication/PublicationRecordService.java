package com.flowableplus.modeler.publication;

import com.flowableplus.contracts.PublicationStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.flowableplus.modeler.audit.AuditEventService;

@Service
public class PublicationRecordService {

    private final PublicationRecordRepository repository;
    private final AuditEventService auditEventService;

    public PublicationRecordService(PublicationRecordRepository repository, AuditEventService auditEventService) {
        this.repository = repository;
        this.auditEventService = auditEventService;
    }

    @Transactional
    public PublicationRecordEntity recordActive(
            String clientId, String modelKey, String versionId, String actorId,
            String runtimeReference, String correlationId) {
        repository.findFirstByClientIdAndModelKeyAndActiveTrueAndStatus(clientId, modelKey, PublicationStatus.ACTIVE)
                .ifPresent(active -> {
                    active.deactivate();
                    repository.save(active);
                });
        PublicationRecordEntity record = repository.save(new PublicationRecordEntity(
                clientId, modelKey, versionId, actorId, PublicationStatus.ACTIVE,
                runtimeReference, null, correlationId, true));
        auditEventService.record(actorId, clientId, modelKey, "PUBLICATION", "ACTIVE", correlationId);
        return record;
    }

    @Transactional
    public PublicationRecordEntity recordFailure(
            String clientId, String modelKey, String versionId, String actorId,
            String failureDetails, String correlationId) {
        PublicationRecordEntity record = repository.save(new PublicationRecordEntity(
                clientId, modelKey, versionId, actorId, PublicationStatus.FAILED,
                null, failureDetails, correlationId, false));
        auditEventService.record(actorId, clientId, modelKey, "PUBLICATION", "FAILED", correlationId);
        return record;
    }

    public PublicationRecordEntity active(String clientId, String modelKey) {
        return repository.findFirstByClientIdAndModelKeyAndActiveTrueAndStatus(clientId, modelKey, PublicationStatus.ACTIVE)
                .orElseThrow();
    }
}
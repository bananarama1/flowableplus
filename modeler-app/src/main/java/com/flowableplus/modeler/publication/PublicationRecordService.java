package com.flowableplus.modeler.publication;

import com.flowableplus.contracts.PublicationStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PublicationRecordService {

    private final PublicationRecordRepository repository;

    public PublicationRecordService(PublicationRecordRepository repository) {
        this.repository = repository;
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
        return repository.save(new PublicationRecordEntity(
                clientId, modelKey, versionId, actorId, PublicationStatus.ACTIVE,
                runtimeReference, null, correlationId, true));
    }

    @Transactional
    public PublicationRecordEntity recordFailure(
            String clientId, String modelKey, String versionId, String actorId,
            String failureDetails, String correlationId) {
        return repository.save(new PublicationRecordEntity(
                clientId, modelKey, versionId, actorId, PublicationStatus.FAILED,
                null, failureDetails, correlationId, false));
    }

    public PublicationRecordEntity active(String clientId, String modelKey) {
        return repository.findFirstByClientIdAndModelKeyAndActiveTrueAndStatus(clientId, modelKey, PublicationStatus.ACTIVE)
                .orElseThrow();
    }
}
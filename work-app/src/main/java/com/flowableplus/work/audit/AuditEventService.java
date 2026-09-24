package com.flowableplus.work.audit;

import java.time.Instant;
import java.util.List;

import com.flowableplus.contracts.AuditEvent;
import org.springframework.stereotype.Service;

@Service
public class AuditEventService {

    private final AuditEventRepository repository;

    public AuditEventService(AuditEventRepository repository) {
        this.repository = repository;
    }

    public void record(String actorId, String clientId, String target, String operation,
            String outcome, String correlationId) {
        repository.save(new AuditEventEntity(actorId, clientId, target, Instant.now(),
                operation, outcome, correlationId));
    }

    public List<AuditEvent> findForClient(String clientId) {
        return repository.findAllByClientIdOrderByTimestampDesc(clientId).stream()
                .map(this::toContract)
                .toList();
    }

    public List<AuditEvent> findForTarget(String clientId, String target) {
        return repository.findAllByClientIdAndTargetOrderByTimestampDesc(clientId, target).stream()
                .map(this::toContract)
                .toList();
    }

    private AuditEvent toContract(AuditEventEntity entity) {
        return new AuditEvent(
                entity.getActorId(),
                entity.getClientId(),
                entity.getTarget(),
                entity.getTimestamp(),
                entity.getOperation(),
                entity.getOutcome(),
                entity.getCorrelationId());
    }
}
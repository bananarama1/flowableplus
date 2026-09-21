package com.flowableplus.modeler.audit;

import org.springframework.stereotype.Service;

@Service
public class AuditEventService {
    private final AuditEventRepository repository;

    public AuditEventService(AuditEventRepository repository) {
        this.repository = repository;
    }

    public void record(String actorId, String clientId, String target, String operation,
            String outcome, String correlationId) {
        repository.save(new AuditEventEntity(actorId, clientId, target, operation, outcome, correlationId));
    }
}
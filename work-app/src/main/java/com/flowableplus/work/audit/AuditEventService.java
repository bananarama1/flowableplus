package com.flowableplus.work.audit;

import java.time.Instant;

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
}
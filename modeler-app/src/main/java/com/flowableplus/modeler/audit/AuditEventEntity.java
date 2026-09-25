package com.flowableplus.modeler.audit;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "audit_event")
public class AuditEventEntity {
    @Id private String id;
    private String actorId;
    private String clientId;
    private String target;
    @Column(nullable = false)
    private Instant timestamp;
    private String operation;
    private String outcome;
    private String correlationId;

    protected AuditEventEntity() { }

    public AuditEventEntity(String actorId, String clientId, String target, String operation,
            String outcome, String correlationId) {
        this.id = UUID.randomUUID().toString();
        this.actorId = actorId;
        this.clientId = clientId;
        this.target = target;
        this.timestamp = Instant.now();
        this.operation = operation;
        this.outcome = outcome;
        this.correlationId = correlationId;
    }
}
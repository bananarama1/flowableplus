package com.flowableplus.work.audit;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "audit_event")
public class AuditEventEntity {

    @Id
    private String id;
    private String actorId;
    private String clientId;
    private String target;
    private Instant timestamp;
    private String operation;
    private String outcome;
    private String correlationId;

    protected AuditEventEntity() {
    }

    public AuditEventEntity(String actorId, String clientId, String target, Instant timestamp,
            String operation, String outcome, String correlationId) {
        this.id = UUID.randomUUID().toString();
        this.actorId = actorId;
        this.clientId = clientId;
        this.target = target;
        this.timestamp = timestamp;
        this.operation = operation;
        this.outcome = outcome;
        this.correlationId = correlationId;
    }

    public String getActorId() { return actorId; }
    public String getClientId() { return clientId; }
    public String getTarget() { return target; }
    public Instant getTimestamp() { return timestamp; }
    public String getOperation() { return operation; }
    public String getOutcome() { return outcome; }
    public String getCorrelationId() { return correlationId; }
}
package com.flowableplus.contracts;

import java.time.Instant;

public record AuditEvent(
        String actorId,
        String clientId,
        String target,
        Instant timestamp,
        String operation,
        String outcome,
        String correlationId) {
}
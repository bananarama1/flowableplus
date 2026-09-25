package com.flowableplus.modeler.security;

import java.util.UUID;

import com.flowableplus.modeler.audit.AuditEventService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService {

    private final AuditEventService auditEventService;

    public AuthorizationService(AuditEventService auditEventService) {
        this.auditEventService = auditEventService;
    }

    public void requireAuthentication(Authentication authentication, String clientId, AuthorizationPermission permission) {
        LocalUser user = authentication != null && authentication.getPrincipal() instanceof LocalUser localUser ? localUser : null;
        if (user == null || !user.clientIds().contains(clientId)) {
            auditEventService.record(user == null ? null : user.username(), clientId, clientId, permission.name(), "DENIED", UUID.randomUUID().toString());
            throw new AuthorizationException("The user is not a member of the requested client");
        }
        if (!user.hasPermission(permission)) {
            auditEventService.record(user.username(), clientId, clientId, permission.name(), "DENIED", UUID.randomUUID().toString());
            throw new AuthorizationException("The user lacks permission " + permission);
        }
    }

    public static class AuthorizationException extends RuntimeException {
        public AuthorizationException(String message) {
            super(message);
        }
    }
}
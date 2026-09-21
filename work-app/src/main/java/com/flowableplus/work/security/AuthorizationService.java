package com.flowableplus.work.security;

import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import java.util.UUID;
import com.flowableplus.work.audit.AuditEventService;

@Service
public class AuthorizationService {

    private final AuditEventService auditEventService;

    public AuthorizationService(AuditEventService auditEventService) {
        this.auditEventService = auditEventService;
    }

    public void require(LocalUser user, String clientId, AuthorizationPermission permission) {
        if (user == null || !user.clientIds().contains(clientId)) {
            auditEventService.record(user == null ? null : user.username(), clientId, clientId,
                    permission.name(), "DENIED", UUID.randomUUID().toString());
            throw new AuthorizationException("The user is not a member of the requested client");
        }
        if (!user.hasPermission(permission)) {
            auditEventService.record(user.username(), clientId, clientId, permission.name(), "DENIED", UUID.randomUUID().toString());
            throw new AuthorizationException("The user lacks permission " + permission);
        }
    }

    public void requireAuthentication(Authentication authentication, String clientId, AuthorizationPermission permission) {
        LocalUser user = authentication != null && authentication.getPrincipal() instanceof LocalUser localUser
                ? localUser : null;
        require(user, clientId, permission);
    }

    public static class AuthorizationException extends RuntimeException {

        public AuthorizationException(String message) {
            super(message);
        }
    }
}
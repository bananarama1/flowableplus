package com.flowableplus.work.publication;

import com.flowableplus.contracts.PublicationContract;
import com.flowableplus.contracts.PublicationEnvelope;
import com.flowableplus.work.security.AuthorizationPermission;
import com.flowableplus.work.security.AuthorizationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/publications")
public class PublicationIntakeController {

    private final PublicationIntakeService service;
    private final AuthorizationService authorizationService;

    public PublicationIntakeController(PublicationIntakeService service, AuthorizationService authorizationService) {
        this.service = service;
        this.authorizationService = authorizationService;
    }

    @PostMapping
    public ResponseEntity<?> publish(
            @RequestBody PublicationEnvelope envelope,
            @RequestHeader(name = PublicationContract.API_VERSION_HEADER, required = false) String apiVersion,
            @RequestHeader(name = PublicationContract.CORRELATION_ID_HEADER, required = false) String correlationId,
            @RequestHeader(name = PublicationContract.IDEMPOTENCY_KEY_HEADER, required = false) String idempotencyKey,
            Authentication authentication) {
            String clientId = envelope == null || envelope.model() == null
                || envelope.model().clientScope() == null
                ? null : envelope.model().clientScope().clientId();
        if (clientId == null) {
            var errors = new java.util.ArrayList<>(PublicationContract.validate(envelope));
            errors.addAll(PublicationContract.validateHeaders(envelope, apiVersion, correlationId, idempotencyKey));
            return ResponseEntity.badRequest().body(errors);
        }
        authorizationService.requireAuthentication(authentication, clientId, AuthorizationPermission.MODEL_PUBLISH);
        var headerErrors = PublicationContract.validateHeaders(envelope, apiVersion, correlationId, idempotencyKey);
        if (!headerErrors.isEmpty()) {
            return ResponseEntity.badRequest().body(headerErrors);
        }
        String actorId = authentication.getPrincipal() instanceof com.flowableplus.work.security.LocalUser user
            ? user.username() : authentication.getName();
        PublicationIntakeService.IntakeResult intake = service.accept(envelope, actorId);
        if (!intake.errors().isEmpty()) {
            return ResponseEntity.badRequest().body(intake.errors());
        }
        HttpStatus status = intake.result().status() == com.flowableplus.contracts.PublicationStatus.ACTIVE
                ? HttpStatus.OK : HttpStatus.UNPROCESSABLE_ENTITY;
        return ResponseEntity.status(status)
                .header(PublicationContract.CORRELATION_ID_HEADER, intake.result().correlationId())
                .body(intake.result());
    }
}
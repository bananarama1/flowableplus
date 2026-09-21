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
            Authentication authentication) {
            String clientId = envelope == null || envelope.model() == null
                ? null : envelope.model().clientScope().clientId();
            authorizationService.requireAuthentication(authentication, clientId, AuthorizationPermission.MODEL_PUBLISH);
        PublicationIntakeService.IntakeResult intake = service.accept(envelope, authentication.getName());
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
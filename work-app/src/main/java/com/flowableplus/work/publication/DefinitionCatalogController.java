package com.flowableplus.work.publication;

import java.util.List;

import com.flowableplus.contracts.RuntimeDefinition;
import com.flowableplus.work.security.AuthorizationPermission;
import com.flowableplus.work.security.AuthorizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/definitions")
public class DefinitionCatalogController {

    private final PublicationIntakeService publicationIntakeService;
    private final AuthorizationService authorizationService;

    public DefinitionCatalogController(
            PublicationIntakeService publicationIntakeService, AuthorizationService authorizationService) {
        this.publicationIntakeService = publicationIntakeService;
        this.authorizationService = authorizationService;
    }

    @GetMapping
    public ResponseEntity<List<RuntimeDefinition>> list(
            @RequestParam String clientId,
            Authentication authentication) {
        authorizationService.requireAuthentication(authentication, clientId, AuthorizationPermission.PROCESS_START);
        return ResponseEntity.ok(publicationIntakeService.activeDefinitions(
                clientId, authentication.getName()));
    }
}
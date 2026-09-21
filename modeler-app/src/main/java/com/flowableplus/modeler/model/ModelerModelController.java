package com.flowableplus.modeler.model;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.flowableplus.contracts.FormSchema;
import com.flowableplus.contracts.ModelType;
import com.flowableplus.modeler.validation.ModelDocumentValidator;
import com.flowableplus.modeler.validation.ModelValidationResult;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/modeler")
public class ModelerModelController {

    private final ModelProjectService projectService;
    private final ModelVersionService versionService;
    private final ModelDocumentValidator validator;

    public ModelerModelController(
            ModelProjectService projectService,
            ModelVersionService versionService,
            ModelDocumentValidator validator) {
        this.projectService = projectService;
        this.versionService = versionService;
        this.validator = validator;
    }

    @GetMapping("/projects")
    public List<ModelProjectEntity> projects(@RequestParam String clientId) {
        return projectService.findForClient(clientId);
    }

    @PostMapping("/projects")
    public ModelProjectEntity createProject(
            @RequestParam String clientId, @RequestBody ProjectRequest request) {
        return projectService.create(clientId, request.modelKey(), request.modelType(), request.displayName(), request.ownerId());
    }

    @GetMapping("/projects/{projectId}/versions")
    public List<ModelVersionEntity> versions(
            @RequestParam String clientId, @PathVariable String projectId) {
        return versionService.findForProject(clientId, projectId);
    }

    @PostMapping("/projects/{projectId}/versions")
    public ModelVersionEntity saveDraft(
            @RequestParam String clientId, @PathVariable String projectId, @RequestBody DocumentRequest request) {
        return versionService.saveDraft(clientId, projectId, request.xml());
    }

    @PutMapping("/versions/{versionId}")
    public ModelVersionEntity updateDraft(
            @RequestParam String clientId, @PathVariable String versionId, @RequestBody DocumentRequest request) {
        return versionService.updateDraft(clientId, versionId, request.xml());
    }

    @PostMapping("/versions/{versionId}/validate")
    public ModelValidationResult validate(
            @RequestParam String clientId, @PathVariable String versionId, @RequestBody ValidationRequest request) {
        ModelVersionEntity version = versionService.findAuthorized(clientId, versionId);
        return validator.validate(request.modelType(), version.getXml(), request.formSchema(), correlationId(request.correlationId()));
    }

    @PostMapping("/versions/{versionId}/publish")
    public ResponseEntity<?> publish(
            @RequestParam String clientId, @PathVariable String versionId, @RequestBody PublishRequest request) {
        ModelVersionEntity version = versionService.findAuthorized(clientId, versionId);
        ModelValidationResult validation = validator.validate(
                request.modelType(), version.getXml(), request.formSchema(), correlationId(request.correlationId()));
        if (!validation.valid()) {
            return ResponseEntity.unprocessableEntity().body(validation);
        }
        return ResponseEntity.ok(Map.of(
                "version", versionService.publish(clientId, versionId),
                "correlationId", correlationId(request.correlationId()),
                "status", "PUBLISHED"));
    }

    private String correlationId(String requested) {
        return requested == null || requested.isBlank() ? UUID.randomUUID().toString() : requested;
    }

    public record ProjectRequest(String modelKey, ModelType modelType, String displayName, String ownerId) { }

    public record DocumentRequest(String xml) { }

    public record ValidationRequest(ModelType modelType, FormSchema formSchema, String correlationId) { }

    public record PublishRequest(ModelType modelType, FormSchema formSchema, String correlationId) { }
}
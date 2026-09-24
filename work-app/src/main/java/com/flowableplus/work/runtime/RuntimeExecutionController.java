package com.flowableplus.work.runtime;

import java.util.List;
import java.util.Map;

import com.flowableplus.contracts.AuditEvent;
import com.flowableplus.flowable.adapter.CaseExecution;
import com.flowableplus.flowable.adapter.HistoryEntry;
import com.flowableplus.flowable.adapter.ProcessExecution;
import com.flowableplus.contracts.FormSchema;
import com.flowableplus.contracts.RuntimeTask;
import com.flowableplus.work.audit.AuditEventService;
import com.flowableplus.work.security.AuthorizationPermission;
import com.flowableplus.work.security.AuthorizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/runtime")
public class RuntimeExecutionController {

    private final RuntimeExecutionService service;
    private final AuthorizationService authorizationService;
    private final AuditEventService auditEventService;

    public RuntimeExecutionController(
            RuntimeExecutionService service,
            AuthorizationService authorizationService,
            AuditEventService auditEventService) {
        this.service = service;
        this.authorizationService = authorizationService;
        this.auditEventService = auditEventService;
    }

    @PostMapping("/processes/{modelKey}/instances")
    public ProcessExecution startProcess(
            @PathVariable String modelKey, @RequestParam String clientId,
            Authentication authentication, @RequestBody Map<String, Object> variables) {
        authorizationService.requireAuthentication(authentication, clientId, AuthorizationPermission.PROCESS_START);
        return service.startProcess(clientId, modelKey, variables, authentication.getName());
    }

    @PostMapping("/cases/{modelKey}/instances")
    public CaseExecution startCase(
            @PathVariable String modelKey, @RequestParam String clientId,
            Authentication authentication, @RequestBody Map<String, Object> variables) {
        authorizationService.requireAuthentication(authentication, clientId, AuthorizationPermission.CASE_START);
        return service.startCase(clientId, modelKey, variables, authentication.getName());
    }

    @GetMapping("/tasks")
    public List<RuntimeTask> tasks(
            @RequestParam String clientId, Authentication authentication) {
        authorizationService.requireAuthentication(authentication, clientId, AuthorizationPermission.TASK_VIEW);
        return service.tasks(clientId, authentication.getName());
    }

    @GetMapping("/tasks/{taskId}")
    public RuntimeExecutionService.TaskDetail task(
            @PathVariable String taskId, @RequestParam String clientId,
            Authentication authentication) {
        authorizationService.requireAuthentication(authentication, clientId, AuthorizationPermission.TASK_VIEW);
        return service.task(clientId, taskId, authentication.getName());
    }

    @GetMapping("/tasks/{taskId}/form")
    public FormSchema form(
            @PathVariable String taskId, @RequestParam String clientId,
            Authentication authentication) {
        authorizationService.requireAuthentication(authentication, clientId, AuthorizationPermission.TASK_VIEW);
        return service.form(clientId, taskId, authentication.getName());
    }

    @PostMapping("/tasks/{taskId}/claim")
    public ResponseEntity<Void> claimTask(
            @PathVariable String taskId, @RequestParam String clientId,
            Authentication authentication) {
        authorizationService.requireAuthentication(authentication, clientId, AuthorizationPermission.TASK_CLAIM);
        service.claimTask(clientId, taskId, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/tasks/{taskId}/complete")
    public ResponseEntity<?> completeTask(
            @PathVariable String taskId, @RequestParam String clientId,
            Authentication authentication, @RequestBody Map<String, Object> variables) {
        authorizationService.requireAuthentication(authentication, clientId, AuthorizationPermission.TASK_COMPLETE);
        RuntimeExecutionService.SubmissionResult result = service.submitTask(
                clientId, taskId, variables, authentication.getName());
        return result.errors().isEmpty()
            ? ResponseEntity.ok(result.nextTasks())
            : ResponseEntity.unprocessableEntity().body(Map.of("errors", result.errors()));
    }

    @GetMapping("/process-instances/{instanceId}")
    public HistoryEntry processDetail(
            @PathVariable String instanceId, @RequestParam String clientId,
            Authentication authentication) {
        authorizationService.requireAuthentication(authentication, clientId, AuthorizationPermission.TASK_VIEW);
        return service.processHistory(clientId, instanceId, authentication.getName());
    }

    @GetMapping("/process-instances/{instanceId}/history")
    public HistoryEntry processHistory(
            @PathVariable String instanceId, @RequestParam String clientId,
            Authentication authentication) {
        authorizationService.requireAuthentication(authentication, clientId, AuthorizationPermission.TASK_VIEW);
        return service.processHistory(clientId, instanceId, authentication.getName());
    }

    @GetMapping("/case-instances/{instanceId}/history")
    public HistoryEntry caseHistory(
            @PathVariable String instanceId, @RequestParam String clientId,
            Authentication authentication) {
        authorizationService.requireAuthentication(authentication, clientId, AuthorizationPermission.TASK_VIEW);
        return service.caseHistory(clientId, instanceId, authentication.getName());
    }

    @GetMapping("/case-instances/{instanceId}")
    public HistoryEntry caseDetail(
            @PathVariable String instanceId, @RequestParam String clientId,
            Authentication authentication) {
        authorizationService.requireAuthentication(authentication, clientId, AuthorizationPermission.TASK_VIEW);
        return service.caseHistory(clientId, instanceId, authentication.getName());
    }

    @GetMapping("/audit")
    public List<AuditEvent> auditEvents(
            @RequestParam String clientId,
            @RequestParam(required = false) String target,
            Authentication authentication) {
        authorizationService.requireAuthentication(authentication, clientId, AuthorizationPermission.TASK_VIEW);
        return target == null || target.isBlank()
                ? auditEventService.findForClient(clientId)
                : auditEventService.findForTarget(clientId, target);
    }
}
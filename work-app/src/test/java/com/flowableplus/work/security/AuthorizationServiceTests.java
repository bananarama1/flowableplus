package com.flowableplus.work.security;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.Set;

import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.mock;
import com.flowableplus.work.audit.AuditEventService;

class AuthorizationServiceTests {

        private final AuthorizationService service = new AuthorizationService(mock(AuditEventService.class));
    private final LocalUser modeler = new LocalUser(
            "modeler", "ignored", Set.of("client-a"), Set.of("MODEL_EDITOR", "PUBLISHER"));
    private final LocalUser worker = new LocalUser(
            "worker", "ignored", Set.of("client-a"), Set.of("WORK_USER"));

    @Test
    void modelerCanEditValidateAndPublishOnlyInMemberClient() {
        service.require(modeler, "client-a", AuthorizationPermission.MODEL_EDIT);
        service.require(modeler, "client-a", AuthorizationPermission.MODEL_VALIDATE);
        service.require(modeler, "client-a", AuthorizationPermission.MODEL_PUBLISH);

        assertThatThrownBy(() -> service.require(modeler, "client-b", AuthorizationPermission.MODEL_PUBLISH))
                .isInstanceOf(AuthorizationService.AuthorizationException.class);
        assertThatThrownBy(() -> service.require(worker, "client-a", AuthorizationPermission.MODEL_PUBLISH))
                .isInstanceOf(AuthorizationService.AuthorizationException.class);
    }

    @Test
    void workerCanStartProcessAndCaseAndViewClaimAndCompleteTasks() {
        service.require(worker, "client-a", AuthorizationPermission.PROCESS_START);
        service.require(worker, "client-a", AuthorizationPermission.CASE_START);
        service.require(worker, "client-a", AuthorizationPermission.TASK_VIEW);
        service.require(worker, "client-a", AuthorizationPermission.TASK_CLAIM);
        service.require(worker, "client-a", AuthorizationPermission.TASK_COMPLETE);

        assertThatThrownBy(() -> service.require(worker, "client-b", AuthorizationPermission.TASK_VIEW))
                .isInstanceOf(AuthorizationService.AuthorizationException.class);
        assertThatThrownBy(() -> service.require(null, "client-a", AuthorizationPermission.TASK_VIEW))
                .isInstanceOf(AuthorizationService.AuthorizationException.class);
    }
}
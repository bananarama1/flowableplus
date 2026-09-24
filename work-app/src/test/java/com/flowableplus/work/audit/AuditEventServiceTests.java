package com.flowableplus.work.audit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;

import com.flowableplus.contracts.AuditEvent;
import org.junit.jupiter.api.Test;

class AuditEventServiceTests {

    private final AuditEventRepository repository = mock(AuditEventRepository.class);
    private final AuditEventService service = new AuditEventService(repository);

    @Test
    void findForClientAndTargetKeepsEventsScopedToTheRequestedClient() {
        when(repository.findAllByClientIdOrderByTimestampDesc("client-a")).thenReturn(List.of(
                new AuditEventEntity("user-a", "client-a", "instance-a", Instant.parse("2026-01-01T00:00:10Z"), "TASK_COMPLETE", "SUCCESS", "corr-3"),
                new AuditEventEntity("user-a", "client-a", "instance-a", Instant.parse("2026-01-01T00:00:00Z"), "PROCESS_START", "SUCCESS", "corr-1")));
        when(repository.findAllByClientIdAndTargetOrderByTimestampDesc("client-a", "instance-a")).thenReturn(List.of(
                new AuditEventEntity("user-a", "client-a", "instance-a", Instant.parse("2026-01-01T00:00:10Z"), "TASK_COMPLETE", "SUCCESS", "corr-3"),
                new AuditEventEntity("user-a", "client-a", "instance-a", Instant.parse("2026-01-01T00:00:00Z"), "PROCESS_START", "SUCCESS", "corr-1")));

        List<AuditEvent> clientEvents = service.findForClient("client-a");
        List<AuditEvent> targetEvents = service.findForTarget("client-a", "instance-a");

        assertThat(clientEvents).hasSize(2);
        assertThat(targetEvents).hasSize(2);
        assertThat(targetEvents).extracting(AuditEvent::operation).containsExactly("TASK_COMPLETE", "PROCESS_START");
        assertThat(clientEvents).extracting(AuditEvent::clientId).containsOnly("client-a");
    }
}

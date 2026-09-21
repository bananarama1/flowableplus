package com.flowableplus.work;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import com.flowableplus.contracts.ClientScope;
import com.flowableplus.contracts.DocumentPayload;
import com.flowableplus.contracts.ModelIdentity;
import com.flowableplus.contracts.ModelType;
import com.flowableplus.contracts.ModelVersion;
import com.flowableplus.contracts.PublicationEnvelope;
import com.flowableplus.contracts.PublicationStatus;
import com.flowableplus.contracts.RuntimeDefinition;
import com.flowableplus.contracts.VersionState;
import com.flowableplus.flowable.adapter.DeploymentReference;
import com.flowableplus.flowable.adapter.FlowableRuntimeAdapter;
import com.flowableplus.flowable.runtime.ClientRuntimeRegistry;
import com.flowableplus.flowable.runtime.ClientRuntimeTarget;
import com.flowableplus.work.publication.PublicationIntakeService;
import com.flowableplus.work.publication.RuntimeCompatibilityValidator;
import com.flowableplus.work.audit.AuditEventService;
import org.junit.jupiter.api.Test;

class PublicationIntakeServiceTests {

    private final ClientRuntimeRegistry registry = mock(ClientRuntimeRegistry.class);
    private final FlowableRuntimeAdapter adapter = mock(FlowableRuntimeAdapter.class);
    private final AuditEventService audit = mock(AuditEventService.class);
    private final PublicationIntakeService service = new PublicationIntakeService(
            registry, adapter, new RuntimeCompatibilityValidator(), audit);

    @Test
    void retriesReturnExistingResultWithoutRedeploying() {
        PublicationEnvelope envelope = publication("client-a", "correlation-1", "client-a:leave:3");
        when(registry.resolve("client-a"))
                .thenReturn(new ClientRuntimeTarget("client-a", "runtime-a", "schema-a", "local"));
        when(adapter.deployBpmn(envelope.document()))
                .thenReturn(new DeploymentReference("deployment-1", "definition-1", "leave"));

        PublicationIntakeService.IntakeResult first = service.accept(envelope, "user-1");
        PublicationIntakeService.IntakeResult retry = service.accept(envelope, "user-1");

        assertThat(first.result().status()).isEqualTo(PublicationStatus.ACTIVE);
        assertThat(retry.result()).isEqualTo(first.result());
        assertThat(retry.duplicate()).isTrue();
        verify(adapter).deployBpmn(envelope.document());
    }

    @Test
    void malformedOrUnauthenticatedPublicationDoesNotReachRuntime() {
        PublicationIntakeService.IntakeResult result = service.accept(null, null);

        assertThat(result.errors()).extracting(error -> error.code())
                .contains("PUBLICATION_REQUIRED", "AUTHENTICATION_REQUIRED");
    }

    @Test
    void unknownClientFailsBeforeDeployment() {
        PublicationEnvelope envelope = publication("client-unknown", "correlation-2", "retry-2");
        when(registry.resolve("client-unknown")).thenThrow(new RuntimeException("unknown client"));

        org.assertj.core.api.Assertions.assertThatThrownBy(() -> service.accept(envelope, "user-1"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("unknown client");
    }

    @Test
    void unsupportedDefinitionFailsWithoutReplacingActivePublication() {
        PublicationEnvelope first = publication("client-a", "correlation-3", "retry-3");
        when(registry.resolve("client-a"))
                .thenReturn(new ClientRuntimeTarget("client-a", "runtime-a", "schema-a", "local"));
        when(adapter.deployBpmn(first.document()))
                .thenReturn(new DeploymentReference("deployment-1", "definition-1", "leave"));
        service.accept(first, "user-1");

        PublicationEnvelope unsupported = new PublicationEnvelope(
                first.model(), first.version(),
                new DocumentPayload(ModelType.BPMN, "leave.bpmn20.xml",
                        "<definitions><process id=\"leave\"><inclusiveGateway id=\"unsupported\"/></process></definitions>"),
                null, "retry-4", "correlation-4", "user-1");

        PublicationIntakeService.IntakeResult result = service.accept(unsupported, "user-1");

        assertThat(result.result().status()).isEqualTo(PublicationStatus.FAILED);
        assertThat(service.activePublications()).containsEntry("client-a|leave", new com.flowableplus.contracts.PublicationResult(
                PublicationStatus.ACTIVE, "correlation-3", "deployment-1", null, null));
        verify(adapter).deployBpmn(first.document());
    }

    @Test
    void catalogOffersOnlyTheActiveDefaultDefinitionForClient() {
        PublicationEnvelope envelope = publication("client-a", "correlation-5", "retry-5");
        when(registry.resolve("client-a"))
                .thenReturn(new ClientRuntimeTarget("client-a", "runtime-a", "schema-a", "local"));
        when(adapter.deployBpmn(envelope.document()))
                .thenReturn(new DeploymentReference("deployment-5", "definition-5", "leave"));

        service.accept(envelope, "user-1");

        assertThat(service.activeDefinitions("client-a", "user-1"))
                .containsExactly(new RuntimeDefinition(
                        new ClientScope("client-a"), "leave", ModelType.BPMN, 3,
                        "Leave request", true, "deployment-5"));
    }

    private PublicationEnvelope publication(String clientId, String correlationId, String idempotencyKey) {
        ModelIdentity identity = new ModelIdentity(
                new ClientScope(clientId), "leave", ModelType.BPMN, "Leave request");
        return new PublicationEnvelope(
                identity,
                new ModelVersion(identity, 3, VersionState.VALIDATED, "sha256:abc"),
                new DocumentPayload(ModelType.BPMN, "leave.bpmn20.xml",
                        "<definitions><process id=\"leave\"><startEvent id=\"start\"/><endEvent id=\"end\"/></process></definitions>"),
                null, idempotencyKey, correlationId, "user-1");
    }
}
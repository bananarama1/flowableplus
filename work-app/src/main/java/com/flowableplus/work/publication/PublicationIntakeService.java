package com.flowableplus.work.publication;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.flowableplus.contracts.PublicationContract;
import com.flowableplus.contracts.PublicationEnvelope;
import com.flowableplus.contracts.PublicationResult;
import com.flowableplus.contracts.PublicationStatus;
import com.flowableplus.contracts.RuntimeDefinition;
import com.flowableplus.contracts.ModelType;
import com.flowableplus.contracts.FormSchema;
import com.flowableplus.contracts.StructuredError;
import com.flowableplus.contracts.VersionState;
import com.flowableplus.flowable.adapter.DeploymentReference;
import com.flowableplus.flowable.adapter.FlowableRuntimeAdapter;
import com.flowableplus.flowable.runtime.ClientRuntimeRegistry;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.flowableplus.work.audit.AuditEventService;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PublicationIntakeService {

    private static final Logger log = LoggerFactory.getLogger(PublicationIntakeService.class);

    private final ClientRuntimeRegistry runtimeRegistry;
    private final FlowableRuntimeAdapter runtimeAdapter;
    private final RuntimeCompatibilityValidator compatibilityValidator;
    private final AuditEventService auditEventService;
    private final PublicationMetrics metrics;
    private final Map<String, PublicationResult> publications = new ConcurrentHashMap<>();
    private final Map<String, PublicationResult> activePublications = new ConcurrentHashMap<>();
    private final Map<String, RuntimeDefinition> activeDefinitions = new ConcurrentHashMap<>();
    private final Map<String, FormSchema> activeFormSchemas = new ConcurrentHashMap<>();

    public PublicationIntakeService(
            ClientRuntimeRegistry runtimeRegistry,
            FlowableRuntimeAdapter runtimeAdapter,
            RuntimeCompatibilityValidator compatibilityValidator,
            AuditEventService auditEventService) {
        this(runtimeRegistry, runtimeAdapter, compatibilityValidator, auditEventService,
                new PublicationMetrics(new SimpleMeterRegistry()));
    }

    @Autowired
    public PublicationIntakeService(
            ClientRuntimeRegistry runtimeRegistry,
            FlowableRuntimeAdapter runtimeAdapter,
            RuntimeCompatibilityValidator compatibilityValidator,
            AuditEventService auditEventService,
            PublicationMetrics metrics) {
        this.runtimeRegistry = runtimeRegistry;
        this.runtimeAdapter = runtimeAdapter;
        this.compatibilityValidator = compatibilityValidator;
        this.auditEventService = auditEventService;
        this.metrics = metrics;
    }

    public synchronized IntakeResult accept(PublicationEnvelope envelope, String actorId) {
        metrics.request();
        log.info("event=publication_received correlationId={} actorId={}", correlationId(envelope), actorId);
        List<StructuredError> errors = PublicationContract.validate(envelope);
        if (isBlank(actorId)) {
            errors = append(errors, new StructuredError(
                    "AUTHENTICATION_REQUIRED", "An authenticated actor is required", correlationId(envelope), List.of()));
        } else if (envelope != null && !actorId.equals(envelope.actorId())) {
            errors = append(errors, new StructuredError(
                    "ACTOR_MISMATCH", "Authenticated actor does not match the publication actor", envelope.correlationId(), List.of()));
        }
        if (!errors.isEmpty()) {
            metrics.failed();
            return IntakeResult.rejected(errors);
        }

        String clientId = envelope.model().clientScope().clientId();
        String publicationKey = clientId + "|" + envelope.model().modelKey()
                + "|" + envelope.version().version() + "|" + envelope.idempotencyKey();
        PublicationResult existing = publications.get(publicationKey);
        if (existing != null) {
            metrics.duplicate();
            auditEventService.record(actorId, clientId, envelope.model().modelKey(), "PUBLICATION", "DUPLICATE", envelope.correlationId());
            log.info("event=publication_duplicate correlationId={} clientId={} modelKey={} version={}",
                    envelope.correlationId(), clientId, envelope.model().modelKey(), envelope.version().version());
            return IntakeResult.accepted(existing, true);
        }

        runtimeRegistry.resolve(clientId);
        if (envelope.version().state() != VersionState.VALIDATED
                && envelope.version().state() != VersionState.PUBLISHED) {
            metrics.failed();
            PublicationResult rejected = new PublicationResult(
                    PublicationStatus.FAILED, envelope.correlationId(), null,
                    "VERSION_NOT_VALIDATED", "Only validated model versions can be published");
            publications.put(publicationKey, rejected);
            auditEventService.record(actorId, clientId, envelope.model().modelKey(), "PUBLICATION", "FAILED", envelope.correlationId());
            return IntakeResult.accepted(rejected, false);
        }

        List<StructuredError> compatibilityErrors = compatibilityValidator.validate(envelope);
        if (!compatibilityErrors.isEmpty()) {
            metrics.failed();
            PublicationResult rejected = new PublicationResult(
                    PublicationStatus.FAILED, envelope.correlationId(), null,
                    compatibilityErrors.get(0).code(), compatibilityErrors.get(0).message());
            publications.put(publicationKey, rejected);
            auditEventService.record(actorId, clientId, envelope.model().modelKey(), "PUBLICATION", "FAILED", envelope.correlationId());
            return IntakeResult.accepted(rejected, false);
        }

        try {
            DeploymentReference deployment = switch (envelope.document().modelType()) {
                case BPMN -> runtimeAdapter.deployBpmn(envelope.document());
                case CMMN -> runtimeAdapter.deployCmmn(envelope.document());
            };
            PublicationResult active = new PublicationResult(
                    PublicationStatus.ACTIVE, envelope.correlationId(), deployment.deploymentId(), null, null);
                metrics.active();
                log.info("event=flowable_deployment_active correlationId={} clientId={} modelKey={} version={} deploymentId={}",
                    envelope.correlationId(), clientId, envelope.model().modelKey(), envelope.version().version(),
                    deployment.deploymentId());
            publications.put(publicationKey, active);
                activePublications.put(activeKey(envelope), active);
                activeDefinitions.put(activeKey(envelope), new RuntimeDefinition(
                    envelope.model().clientScope(), envelope.model().modelKey(), envelope.model().modelType(),
                    envelope.version().version(), envelope.model().displayName(), true, deployment.deploymentId()));
                if (envelope.formSchema() != null) {
                    activeFormSchemas.put(activeKey(envelope), envelope.formSchema());
                }
                auditEventService.record(actorId, clientId, envelope.model().modelKey(), "PUBLICATION", "ACTIVE", envelope.correlationId());
            return IntakeResult.accepted(active, false);
        } catch (RuntimeException exception) {
            metrics.failed();
            log.warn("event=flowable_deployment_failed correlationId={} clientId={} modelKey={} version={} reason={}",
                envelope.correlationId(), clientId, envelope.model().modelKey(), envelope.version().version(),
                exception.getClass().getSimpleName());
            PublicationResult failed = new PublicationResult(
                    PublicationStatus.FAILED, envelope.correlationId(), null,
                    "RUNTIME_DEPLOYMENT_FAILED", "The runtime rejected the publication");
            publications.put(publicationKey, failed);
            auditEventService.record(actorId, clientId, envelope.model().modelKey(), "PUBLICATION", "FAILED", envelope.correlationId());
            return IntakeResult.accepted(failed, false);
        }
    }

    public Map<String, PublicationResult> activePublications() {
        return Map.copyOf(activePublications);
    }

    public List<RuntimeDefinition> activeDefinitions(String clientId, String actorId) {
        if (isBlank(actorId)) {
            throw new PublicationAuthenticationException();
        }
        return activeDefinitions.values().stream()
                .filter(definition -> definition.clientScope().clientId().equals(clientId))
                .toList();
    }

    public RuntimeDefinition activeDefinition(String clientId, String modelKey, ModelType modelType, String actorId) {
        return activeDefinitions(clientId, actorId).stream()
                .filter(definition -> definition.modelKey().equals(modelKey) && definition.modelType() == modelType)
                .findFirst()
                .orElseThrow(() -> new RuntimeDefinitionNotFoundException(modelKey));
    }

    public FormSchema activeFormSchema(String clientId, String modelKey, String actorId) {
        activeDefinitions(clientId, actorId).stream()
                .filter(definition -> definition.modelKey().equals(modelKey))
                .findFirst()
                .orElseThrow(() -> new RuntimeDefinitionNotFoundException(modelKey));
        return activeFormSchemas.get(activeKey(clientId, modelKey));
    }

    private String activeKey(PublicationEnvelope envelope) {
        return envelope.model().clientScope().clientId() + "|" + envelope.model().modelKey();
    }

    private String activeKey(String clientId, String modelKey) {
        return clientId + "|" + modelKey;
    }

    private List<StructuredError> append(List<StructuredError> errors, StructuredError error) {
        return java.util.stream.Stream.concat(errors.stream(), java.util.stream.Stream.of(error)).toList();
    }

    private String correlationId(PublicationEnvelope envelope) {
        return envelope == null ? null : envelope.correlationId();
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    public record IntakeResult(PublicationResult result, List<StructuredError> errors, boolean duplicate) {

        static IntakeResult accepted(PublicationResult result, boolean duplicate) {
            return new IntakeResult(result, List.of(), duplicate);
        }

        static IntakeResult rejected(List<StructuredError> errors) {
            return new IntakeResult(null, errors, false);
        }
    }
}
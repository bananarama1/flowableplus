package com.flowableplus.flowable.runtime;

import java.util.Collection;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

public class InMemoryClientRuntimeRegistry implements ClientRuntimeRegistry, ClientRuntimeProvisioner {

    private final Map<String, ClientRuntimeTarget> targets;

    public InMemoryClientRuntimeRegistry(Collection<ClientRuntimeTarget> targets) {
        Objects.requireNonNull(targets, "targets");
        targets.forEach(InMemoryClientRuntimeRegistry::validateTarget);
        this.targets = targets.stream()
                .collect(Collectors.toUnmodifiableMap(ClientRuntimeTarget::clientId, Function.identity()));
    }

    private static void validateTarget(ClientRuntimeTarget target) {
        Objects.requireNonNull(target, "target");
        requireText(target.clientId(), "clientId");
        requireText(target.runtimeId(), "runtimeId");
        requireText(target.databaseSchema(), "databaseSchema");
        requireText(target.publicationBaseUrl(), "publicationBaseUrl");
        if (!target.databaseSchema().matches("[A-Za-z_][A-Za-z0-9_]*")) {
            throw new IllegalArgumentException("databaseSchema must be a safe SQL identifier");
        }
    }

    private static void requireText(String value, String field) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(field + " is required");
        }
    }

    @Override
    public ClientRuntimeTarget resolve(String clientId) {
        ClientRuntimeTarget target = targets.get(clientId);
        if (target == null) {
            throw new UnknownClientException(clientId);
        }
        return target;
    }

    @Override
    public ClientRuntimeTarget provision(RuntimeProvisioningRequest request) {
        return resolve(request.clientId());
    }
}
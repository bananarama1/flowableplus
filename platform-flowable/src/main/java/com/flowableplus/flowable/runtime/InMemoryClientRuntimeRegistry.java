package com.flowableplus.flowable.runtime;

import java.util.Collection;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public class InMemoryClientRuntimeRegistry implements ClientRuntimeRegistry, ClientRuntimeProvisioner {

    private final Map<String, ClientRuntimeTarget> targets;

    public InMemoryClientRuntimeRegistry(Collection<ClientRuntimeTarget> targets) {
        this.targets = targets.stream()
                .collect(Collectors.toUnmodifiableMap(ClientRuntimeTarget::clientId, Function.identity()));
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
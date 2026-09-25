package com.flowableplus.modeler.security;

import java.util.Set;

public enum AuthorizationPermission {
    MODEL_EDIT(Set.of("MODEL_EDITOR")),
    MODEL_VALIDATE(Set.of("MODEL_EDITOR")),
    MODEL_PUBLISH(Set.of("PUBLISHER"));

    private final Set<String> roles;

    AuthorizationPermission(Set<String> roles) {
        this.roles = roles;
    }

    public Set<String> roles() {
        return roles;
    }
}
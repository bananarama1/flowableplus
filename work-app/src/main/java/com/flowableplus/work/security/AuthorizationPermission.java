package com.flowableplus.work.security;

import java.util.Set;

public enum AuthorizationPermission {
    MODEL_EDIT(Set.of("MODEL_EDITOR")),
    MODEL_VALIDATE(Set.of("MODEL_EDITOR")),
    MODEL_PUBLISH(Set.of("PUBLISHER")),
    PROCESS_START(Set.of("WORK_USER")),
    CASE_START(Set.of("WORK_USER")),
    TASK_VIEW(Set.of("WORK_USER")),
    TASK_CLAIM(Set.of("WORK_USER")),
    TASK_COMPLETE(Set.of("WORK_USER"));

    private final Set<String> roles;

    AuthorizationPermission(Set<String> roles) {
        this.roles = roles;
    }

    public Set<String> roles() {
        return roles;
    }
}
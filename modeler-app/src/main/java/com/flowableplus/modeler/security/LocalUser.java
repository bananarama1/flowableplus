package com.flowableplus.modeler.security;

import java.util.Set;

public record LocalUser(String username, String password, Set<String> clientIds, Set<String> roles) {

    public boolean hasPermission(AuthorizationPermission permission) {
        return roles.stream().anyMatch(role -> permission.roles().contains(role));
    }
}
package com.flowableplus.work.security;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class LocalTokenService {

    private final Map<String, IssuedToken> tokens = new ConcurrentHashMap<>();
    private final Map<String, LocalUser> users = Map.of(
            "alice", new LocalUser("alice", "local-password", java.util.Set.of("client-local"), java.util.Set.of("WORK_USER")),
            "modeler", new LocalUser("modeler", "local-password", java.util.Set.of("client-local"), java.util.Set.of("MODEL_EDITOR", "PUBLISHER")));
    private final Duration tokenLifetime;

    public LocalTokenService(
            @Value("${flowableplus.security.local-token-lifetime:PT1H}") Duration tokenLifetime) {
        this.tokenLifetime = tokenLifetime;
    }

    public TokenResponse issue(String username, String password) {
        LocalUser user = users.get(username);
        if (user == null || !user.password().equals(password)) {
            throw new InvalidCredentialsException();
        }
        String token = UUID.randomUUID().toString();
        Instant expiresAt = Instant.now().plus(tokenLifetime);
        tokens.put(token, new IssuedToken(user, expiresAt));
        return new TokenResponse(token, "Bearer", tokenLifetime.toSeconds());
    }

    public LocalUser authenticate(String token) {
        IssuedToken issued = tokens.get(token);
        if (issued == null || !issued.expiresAt().isAfter(Instant.now())) {
            if (issued != null) {
                tokens.remove(token);
            }
            return null;
        }
        return issued.user();
    }

    public record TokenRequest(String username, String password) {
    }

    public record TokenResponse(String accessToken, String tokenType, long expiresIn) {
    }

    private record IssuedToken(LocalUser user, Instant expiresAt) {
    }
}
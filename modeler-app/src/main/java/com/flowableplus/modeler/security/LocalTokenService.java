package com.flowableplus.modeler.security;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class LocalTokenService {

    private final Map<String, LocalUser> users = Map.of(
            "alice", new LocalUser("alice", "local-password", java.util.Set.of("client-local"), java.util.Set.of("MODEL_EDITOR")),
            "modeler", new LocalUser("modeler", "local-password", java.util.Set.of("client-local"), java.util.Set.of("MODEL_EDITOR", "PUBLISHER")));
    private final Duration tokenLifetime;
    private final String tokenSecret;

    public LocalTokenService(Duration tokenLifetime) {
        this(tokenLifetime, "flowableplus-local-development-secret");
    }

    @Autowired
    public LocalTokenService(
            @Value("${flowableplus.security.local-token-lifetime:PT1H}") Duration tokenLifetime,
            @Value("${flowableplus.security.local-token-secret:flowableplus-local-development-secret}") String tokenSecret) {
        this.tokenLifetime = tokenLifetime;
        this.tokenSecret = tokenSecret;
    }

    public TokenResponse issue(String username, String password) {
        LocalUser user = users.get(username);
        if (user == null || !user.password().equals(password)) {
            throw new InvalidCredentialsException();
        }
        long expiresAt = Instant.now().plus(tokenLifetime).getEpochSecond();
        String payload = user.username() + "." + expiresAt;
        String token = payload + "." + sign(payload);
        return new TokenResponse(token, "Bearer", tokenLifetime.toSeconds());
    }

    public LocalUser authenticate(String token) {
        if (token == null) {
            return null;
        }
        String[] parts = token.split("\\.", -1);
        if (parts.length != 3 || !MessageDigest.isEqual(parts[2].getBytes(StandardCharsets.UTF_8),
                sign(parts[0] + "." + parts[1]).getBytes(StandardCharsets.UTF_8))) {
            return null;
        }
        try {
            if (Long.parseLong(parts[1]) <= Instant.now().getEpochSecond()) {
                return null;
            }
        } catch (NumberFormatException exception) {
            return null;
        }
        return users.get(parts[0]);
    }

    public record TokenRequest(String username, String password) { }

    public record TokenResponse(String accessToken, String tokenType, long expiresIn) { }

    private String sign(String payload) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(tokenSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
        } catch (java.security.GeneralSecurityException exception) {
            throw new IllegalStateException("HMAC-SHA256 is required", exception);
        }
    }
}
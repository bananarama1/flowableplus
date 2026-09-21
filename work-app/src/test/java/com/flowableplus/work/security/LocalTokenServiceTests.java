package com.flowableplus.work.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Duration;

import org.junit.jupiter.api.Test;

class LocalTokenServiceTests {

    @Test
    void issuesBearerTokenForSeededLocalUser() {
        LocalTokenService service = new LocalTokenService(Duration.ofHours(1));

        LocalTokenService.TokenResponse response = service.issue("alice", "local-password");

        assertThat(response.tokenType()).isEqualTo("Bearer");
        assertThat(service.authenticate(response.accessToken()).username()).isEqualTo("alice");
        assertThat(service.authenticate(response.accessToken()).clientIds()).containsExactly("client-local");
    }

    @Test
    void rejectsInvalidCredentialsAndUnknownTokens() {
        LocalTokenService service = new LocalTokenService(Duration.ofHours(1));

        assertThatThrownBy(() -> service.issue("alice", "wrong"))
                .isInstanceOf(InvalidCredentialsException.class);
        assertThat(service.authenticate("unknown-token")).isNull();
    }

    @Test
    void expiresTokens() {
        LocalTokenService service = new LocalTokenService(Duration.ZERO);
        String token = service.issue("alice", "local-password").accessToken();

        assertThat(service.authenticate(token)).isNull();
    }
}
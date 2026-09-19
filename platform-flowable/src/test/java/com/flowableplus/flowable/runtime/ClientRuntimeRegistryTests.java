package com.flowableplus.flowable.runtime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;

import org.junit.jupiter.api.Test;

class ClientRuntimeRegistryTests {

    private final ClientRuntimeTarget clientA = new ClientRuntimeTarget(
            "client-a", "runtime-a", "flowable_client_a", "http://work-a.internal");
    private final ClientRuntimeRegistry registry = new InMemoryClientRuntimeRegistry(List.of(clientA));

    @Test
    void resolvesExactlyOneConfiguredRuntimeForClient() {
        assertThat(registry.resolve("client-a")).isEqualTo(clientA);
    }

    @Test
    void unknownClientFailsClosed() {
        assertThatThrownBy(() -> registry.resolve("client-b"))
                .isInstanceOf(UnknownClientException.class)
                .hasMessageContaining("client-b");
    }

    @Test
    void publicTargetContainsNoDatabaseCredentials() {
        assertThat(ClientRuntimeTarget.class.getRecordComponents())
                .extracting(component -> component.getName())
                .doesNotContain("username", "password", "secret", "credentials");
    }
}
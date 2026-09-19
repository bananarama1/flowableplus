package com.flowableplus.modeler;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class HealthControllerTests {

    @Test
    void exposesIndependentHealthWithCorrelationId() {
        assertThat(new HealthController().health("health-1"))
                .containsEntry("application", "modeler-app")
                .containsEntry("status", "UP")
                .containsEntry("correlationId", "health-1");
    }
}
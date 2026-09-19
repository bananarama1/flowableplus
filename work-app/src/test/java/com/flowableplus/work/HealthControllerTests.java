package com.flowableplus.work;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

import org.junit.jupiter.api.Test;
import org.flowable.engine.RuntimeService;

class HealthControllerTests {

    @Test
    void exposesIndependentHealthWithFlowableRuntime() {
        RuntimeService runtimeService = mock(RuntimeService.class);
        assertThat(new HealthController(runtimeService).health("health-1"))
                .containsEntry("application", "work-app")
                .containsEntry("status", "UP")
                .containsEntry("flowableRuntime", "UP")
                .containsEntry("correlationId", "health-1");
    }
}
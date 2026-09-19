package com.flowableplus.work;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

import java.util.Map;

import org.flowable.engine.RuntimeService;
import org.junit.jupiter.api.Test;

class FlowableStatusControllerTests {

    @Test
    void preservesStatusFieldsAndAddsCorrelationId() {
        Map<String, Object> response = new FlowableStatusController(mock(RuntimeService.class))
                .flowableStatus("status-1")
                .getBody();

        assertThat(response)
                .containsEntry("runtimeServiceAvailable", true)
                .containsEntry("status", "UP")
                .containsEntry("correlationId", "status-1");
    }
}
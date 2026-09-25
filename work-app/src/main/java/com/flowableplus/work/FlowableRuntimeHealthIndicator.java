package com.flowableplus.work;

import org.flowable.engine.RuntimeService;
import org.springframework.boot.health.contributor.Health;
import org.springframework.boot.health.contributor.HealthIndicator;
import org.springframework.stereotype.Component;

@Component("flowableRuntime")
public class FlowableRuntimeHealthIndicator implements HealthIndicator {

    private final RuntimeService runtimeService;

    public FlowableRuntimeHealthIndicator(RuntimeService runtimeService) {
        this.runtimeService = runtimeService;
    }

    @Override
    public Health health() {
        try {
            long runningInstances = runtimeService.createProcessInstanceQuery().count();
            return Health.up()
                    .withDetail("runningProcessInstances", runningInstances)
                    .build();
        } catch (RuntimeException exception) {
            return Health.down()
                    .withDetail("reason", "Flowable runtime query failed")
                    .build();
        }
    }
}
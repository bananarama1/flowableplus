package com.flowableplus.modeler.publication;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Component;

@Component
public class PublicationMetrics {

    private final Counter requests;
    private final Counter active;
    private final Counter failed;

    public PublicationMetrics(MeterRegistry registry) {
        this.requests = registry.counter("flowableplus.publication.requests", "application", "modeler");
        this.active = registry.counter("flowableplus.publication.active", "application", "modeler");
        this.failed = registry.counter("flowableplus.publication.failed", "application", "modeler");
    }

    public void request() {
        requests.increment();
    }

    public void active() {
        active.increment();
    }

    public void failed() {
        failed.increment();
    }
}
package com.flowableplus.work.publication;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Component;

@Component
public class PublicationMetrics {

    private final Counter requests;
    private final Counter duplicates;
    private final Counter active;
    private final Counter failed;

    public PublicationMetrics(MeterRegistry registry) {
        this.requests = registry.counter("flowableplus.publication.requests", "application", "work");
        this.duplicates = registry.counter("flowableplus.publication.duplicates", "application", "work");
        this.active = registry.counter("flowableplus.publication.active", "application", "work");
        this.failed = registry.counter("flowableplus.publication.failed", "application", "work");
    }

    public void request() {
        requests.increment();
    }

    public void duplicate() {
        duplicates.increment();
    }

    public void active() {
        active.increment();
    }

    public void failed() {
        failed.increment();
    }
}
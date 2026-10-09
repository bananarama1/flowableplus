package com.flowableplus.work.testsupport;

import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.PostgreSQLContainer;

public final class FlowablePlusTestContainers {

    private FlowablePlusTestContainers() {
    }

    public static PostgreSQLContainer<?> postgres() {
        return new PostgreSQLContainer<>("postgres:16-alpine");
    }

    public static GenericContainer<?> mailpit() {
        return new GenericContainer<>("axllent/mailpit:v1.21.8")
                .withExposedPorts(1025, 8025);
    }
}
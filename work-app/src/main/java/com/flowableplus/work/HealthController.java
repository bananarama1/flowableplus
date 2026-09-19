package com.flowableplus.work;

import java.util.Map;
import java.util.UUID;

import org.flowable.engine.RuntimeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    private final RuntimeService runtimeService;

    public HealthController(RuntimeService runtimeService) {
        this.runtimeService = runtimeService;
    }

    @GetMapping("/health")
    public Map<String, Object> health(
            @RequestHeader(value = "X-Correlation-Id", required = false) String correlationId) {
        boolean available = runtimeService != null;
        return Map.of(
                "application", "work-app",
                "status", available ? "UP" : "DOWN",
                "flowableRuntime", available ? "UP" : "DOWN",
                "correlationId", correlationId == null ? UUID.randomUUID().toString() : correlationId);
    }
}
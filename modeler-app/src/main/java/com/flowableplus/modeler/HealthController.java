package com.flowableplus.modeler;

import java.util.Map;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/health")
    public Map<String, Object> health(
            @RequestHeader(value = "X-Correlation-Id", required = false) String correlationId) {
        return Map.of(
                "application", "modeler-app",
                "status", "UP",
                "correlationId", correlationId == null ? UUID.randomUUID().toString() : correlationId);
    }
}
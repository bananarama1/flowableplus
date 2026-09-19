package com.flowableplus.work;

import java.util.Map;
import java.util.UUID;

import org.flowable.engine.RuntimeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FlowableStatusController {

    private final RuntimeService runtimeService;

    public FlowableStatusController(RuntimeService runtimeService) {
        this.runtimeService = runtimeService;
    }

    @GetMapping("/flowable/status")
    public ResponseEntity<Map<String, Object>> flowableStatus(
            @RequestHeader(value = "X-Correlation-Id", required = false) String correlationId) {
        boolean available = runtimeService != null;

        return ResponseEntity.ok(Map.of(
                "runtimeServiceAvailable", available,
                "status", available ? "UP" : "DOWN",
                "message", available ? "Flowable RuntimeService is available." : "Flowable RuntimeService is not available.",
                "correlationId", correlationId == null ? UUID.randomUUID().toString() : correlationId
        ));
    }
}
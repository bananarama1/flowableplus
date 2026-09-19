package com.flowableplus.parent;

import java.util.Map;

import org.flowable.engine.RuntimeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FlowableStatusController {

    private final RuntimeService runtimeService;

    public FlowableStatusController(RuntimeService runtimeService) {
        this.runtimeService = runtimeService;
    }

    @GetMapping("/flowable/status")
    public ResponseEntity<Map<String, Object>> flowableStatus() {
        boolean available = runtimeService != null;

        return ResponseEntity.ok(Map.of(
                "runtimeServiceAvailable", available,
                "status", available ? "UP" : "DOWN",
                "message", available ? "Flowable RuntimeService is available." : "Flowable RuntimeService is not available."
        ));
    }
}

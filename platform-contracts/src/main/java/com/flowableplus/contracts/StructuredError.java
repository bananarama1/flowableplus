package com.flowableplus.contracts;

import java.util.List;

public record StructuredError(
        String code,
        String message,
        String correlationId,
        List<ErrorDetail> details) {
}
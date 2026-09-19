package com.flowableplus.modeler.validation;

import java.util.List;

import com.flowableplus.contracts.StructuredError;

public record ModelValidationResult(
        boolean valid,
        NormalizedModelMetadata metadata,
        List<StructuredError> errors) {
}
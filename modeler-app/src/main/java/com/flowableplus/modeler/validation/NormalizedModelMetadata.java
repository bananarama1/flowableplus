package com.flowableplus.modeler.validation;

import java.util.List;

import com.flowableplus.contracts.ModelType;

public record NormalizedModelMetadata(
        ModelType modelType,
        String modelKey,
        String displayName,
        List<String> taskIds) {
}
package com.flowableplus.contracts;

public record RuntimeDefinition(
        ClientScope clientScope,
        String modelKey,
        ModelType modelType,
        int version,
        String displayName,
        boolean startable,
        String runtimeReference) {
}
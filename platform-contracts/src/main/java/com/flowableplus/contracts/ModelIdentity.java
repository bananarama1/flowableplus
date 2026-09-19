package com.flowableplus.contracts;

public record ModelIdentity(
        ClientScope clientScope,
        String modelKey,
        ModelType modelType,
        String displayName) {
}
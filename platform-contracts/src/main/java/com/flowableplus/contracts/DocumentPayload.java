package com.flowableplus.contracts;

public record DocumentPayload(
        ModelType modelType,
        String fileName,
        String xml) {
}
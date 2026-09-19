package com.flowableplus.contracts;

public record ModelVersion(
        ModelIdentity model,
        int version,
        VersionState state,
        String contentHash) {
}
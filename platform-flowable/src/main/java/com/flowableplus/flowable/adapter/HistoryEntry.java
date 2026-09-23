package com.flowableplus.flowable.adapter;

import java.time.Instant;

public record HistoryEntry(
        String instanceId,
        String definitionKey,
        int definitionVersion,
        String state,
        Instant startedAt,
        Instant endedAt) {
}
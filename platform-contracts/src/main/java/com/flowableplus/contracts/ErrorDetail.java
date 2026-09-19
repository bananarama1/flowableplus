package com.flowableplus.contracts;

public record ErrorDetail(
        String field,
        String code,
        String message) {
}
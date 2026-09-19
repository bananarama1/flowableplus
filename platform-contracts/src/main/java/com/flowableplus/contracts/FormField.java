package com.flowableplus.contracts;

import java.util.List;

public record FormField(
        String id,
        String label,
        FormFieldType type,
        boolean required,
        Object initialValue,
        String variableName,
        List<String> options) {
}
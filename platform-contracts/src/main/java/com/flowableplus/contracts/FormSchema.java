package com.flowableplus.contracts;

import java.util.List;

public record FormSchema(
        String schemaVersion,
        List<FormField> fields) {
}
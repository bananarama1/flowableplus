package com.flowableplus.work.publication;

public class RuntimeDefinitionNotFoundException extends RuntimeException {

    public RuntimeDefinitionNotFoundException(String modelKey) {
        super("No active runtime definition is available for model: " + modelKey);
    }
}
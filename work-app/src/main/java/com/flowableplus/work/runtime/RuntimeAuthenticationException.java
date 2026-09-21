package com.flowableplus.work.runtime;

public class RuntimeAuthenticationException extends RuntimeException {

    public RuntimeAuthenticationException() {
        super("An authenticated actor is required");
    }
}
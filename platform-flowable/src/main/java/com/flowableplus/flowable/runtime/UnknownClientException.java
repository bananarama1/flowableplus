package com.flowableplus.flowable.runtime;

public class UnknownClientException extends RuntimeException {

    public UnknownClientException(String clientId) {
        super("No Flowable runtime is configured for client: " + clientId);
    }
}
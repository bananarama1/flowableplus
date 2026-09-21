package com.flowableplus.work.publication;

public class PublicationAuthenticationException extends RuntimeException {

    public PublicationAuthenticationException() {
        super("An authenticated actor is required");
    }
}
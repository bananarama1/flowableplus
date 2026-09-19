package com.flowableplus.modeler.model;

public class PublishedVersionMutationException extends RuntimeException {

    public PublishedVersionMutationException(String versionId) {
        super("Published model version cannot be edited: " + versionId);
    }
}
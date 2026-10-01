package com.flowableplus.work.runtime;

import java.util.List;

import com.flowableplus.contracts.ErrorDetail;

public class RuntimeStartValidationException extends RuntimeException {

    private final List<ErrorDetail> errors;

    public RuntimeStartValidationException(List<ErrorDetail> errors) {
        super("Initial process variables are invalid");
        this.errors = List.copyOf(errors);
    }

    public List<ErrorDetail> errors() {
        return errors;
    }
}
package com.flowableplus.modeler;

import java.util.Map;
import java.util.NoSuchElementException;

import com.flowableplus.modeler.model.PublishedVersionMutationException;
import com.flowableplus.modeler.security.AuthorizationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ModelerExceptionHandler {

    @ExceptionHandler(AuthorizationService.AuthorizationException.class)
    public ResponseEntity<Map<String, String>> authorization(AuthorizationService.AuthorizationException exception) {
        return response(HttpStatus.FORBIDDEN, "The requested model is not available.");
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, String>> notFound() {
        return response(HttpStatus.NOT_FOUND, "The requested model is not available.");
    }

    @ExceptionHandler(PublishedVersionMutationException.class)
    public ResponseEntity<Map<String, String>> publishedVersion(PublishedVersionMutationException exception) {
        return response(HttpStatus.CONFLICT, "Published model versions are immutable; create a draft first.");
    }

    private ResponseEntity<Map<String, String>> response(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of("message", message));
    }
}
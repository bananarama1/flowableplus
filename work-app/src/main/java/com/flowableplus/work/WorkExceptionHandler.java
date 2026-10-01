package com.flowableplus.work;

import java.util.Map;

import com.flowableplus.work.publication.PublicationAuthenticationException;
import com.flowableplus.work.publication.RuntimeDefinitionNotFoundException;
import com.flowableplus.work.runtime.RuntimeAccessException;
import com.flowableplus.work.runtime.RuntimeAuthenticationException;
import com.flowableplus.work.runtime.RuntimeStartValidationException;
import com.flowableplus.work.security.AuthorizationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class WorkExceptionHandler {

    @ExceptionHandler(AuthorizationService.AuthorizationException.class)
    public ResponseEntity<Map<String, String>> authorization(AuthorizationService.AuthorizationException exception) {
        return response(HttpStatus.FORBIDDEN, "The requested client scope is not available.");
    }

    @ExceptionHandler({RuntimeAuthenticationException.class, PublicationAuthenticationException.class})
    public ResponseEntity<Map<String, String>> authentication(RuntimeException exception) {
        return response(HttpStatus.UNAUTHORIZED, "Authentication is required.");
    }

    @ExceptionHandler(RuntimeAccessException.class)
    public ResponseEntity<Map<String, String>> access(RuntimeAccessException exception) {
        return response(HttpStatus.FORBIDDEN, "The requested runtime resource is not available.");
    }

    @ExceptionHandler(RuntimeDefinitionNotFoundException.class)
    public ResponseEntity<Map<String, String>> definitionNotFound(RuntimeDefinitionNotFoundException exception) {
        return response(HttpStatus.NOT_FOUND, "The requested runtime definition is not available.");
    }

    @ExceptionHandler(RuntimeStartValidationException.class)
    public ResponseEntity<Map<String, Object>> invalidStart(RuntimeStartValidationException exception) {
        return ResponseEntity.unprocessableEntity().body(Map.of("errors", exception.errors()));
    }

    private <T> ResponseEntity<Map<String, T>> response(HttpStatus status, T message) {
        return ResponseEntity.status(status).body(Map.of("message", message));
    }
}

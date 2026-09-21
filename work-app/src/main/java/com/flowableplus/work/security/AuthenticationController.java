package com.flowableplus.work.security;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final LocalTokenService tokenService;

    public AuthenticationController(LocalTokenService tokenService) {
        this.tokenService = tokenService;
    }

    @PostMapping("/token")
    public ResponseEntity<LocalTokenService.TokenResponse> token(
            @RequestBody LocalTokenService.TokenRequest request) {
        return ResponseEntity.ok(tokenService.issue(request.username(), request.password()));
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Void> invalidCredentials() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
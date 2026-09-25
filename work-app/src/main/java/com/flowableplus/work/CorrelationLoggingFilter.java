package com.flowableplus.work;

import java.io.IOException;
import java.util.UUID;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class CorrelationLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(CorrelationLoggingFilter.class);
    private static final String CORRELATION_HEADER = "X-Correlation-Id";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        String correlationId = request.getHeader(CORRELATION_HEADER);
        if (correlationId == null || correlationId.isBlank()) {
            correlationId = UUID.randomUUID().toString();
        }
        long startedAt = System.nanoTime();
        MDC.put("correlationId", correlationId);
        response.setHeader(CORRELATION_HEADER, correlationId);
        try {
            filterChain.doFilter(request, response);
        } finally {
            log.info("event=http_request correlationId={} method={} path={} status={} durationMs={}",
                    correlationId, request.getMethod(), request.getRequestURI(), response.getStatus(),
                    (System.nanoTime() - startedAt) / 1_000_000);
            MDC.remove("correlationId");
        }
    }
}
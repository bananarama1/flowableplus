# ADR-006: PostgreSQL and Classpath Model Deployment

Status: Accepted
Date: 2026-10-11

## Context

The first application version needs predictable startup and durable workflow state without introducing an application-owned domain schema.

## Decision

Use PostgreSQL as the canonical supported database from the beginning. Use Flowable's own database tables and schemas for the first version. Deploy the supported process models from the classpath during application startup.

## Consequences

- Local Compose and integration environments use PostgreSQL.
- H2 is not the reference behavior for the application.
- Process models are versioned with the application source.
- Runtime model editing and database-managed model deployment are deferred.
- Application-owned business tables are deferred until a concrete requirement exists.

## Implementation note

The integration-test profile already uses PostgreSQL. The Docker application profile still points to H2 and must be switched to the Compose PostgreSQL service before this decision is fully implemented.

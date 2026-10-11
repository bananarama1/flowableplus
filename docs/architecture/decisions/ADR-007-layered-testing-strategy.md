# ADR-007: Layered Testing Strategy

Status: Accepted
Date: 2026-10-11

## Context

The first slice crosses Java configuration, Flowable engines, REST, authentication, PostgreSQL, and a React UI. One test type cannot provide useful coverage for all of these boundaries.

## Decision

Use three layers:

1. Unit and slice tests for focused Java behavior.
2. `flowableplus-work-integration-tests` for black-box starter, REST, persistence, authentication, and Flowable behavior using Testcontainers.
3. Playwright for browser end-to-end tests against the complete Compose stack.

The primary Playwright scenario is the complete approval journey defined in ADR-002.

## Consequences

- Java integration tests can diagnose backend and REST failures precisely.
- Playwright verifies the real browser workflow and session behavior.
- The Flowable REST endpoints used by the UI receive contract coverage.
- Flowable upgrades require running both REST integration tests and Playwright tests.

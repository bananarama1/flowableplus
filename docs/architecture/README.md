# Architecture

This directory is the durable architecture reference for Flowable Plus.

## Reading order

1. Read the accepted ADRs for the reasons behind the system boundaries.
2. Read [api-strategy.md](api-strategy.md) for REST and authentication behavior.
3. Read [testing-strategy.md](testing-strategy.md) for executable quality boundaries.
4. Read [DEVELOPMENT.md](../../DEVELOPMENT.md) for local commands and environment details.

## Accepted decisions

- [ADR-001: Flowable OSS foundation](decisions/ADR-001-flowable-oss-foundation.md)
- [ADR-002: First application vertical slice](decisions/ADR-002-first-application-slice.md)
- [ADR-003: Native Flowable REST API](decisions/ADR-003-native-flowable-rest-api.md)
- [ADR-004: Starter and module boundaries](decisions/ADR-004-starter-and-module-boundaries.md)
- [ADR-005: Initial authentication and identity](decisions/ADR-005-initial-authentication-and-identity.md)
- [ADR-006: PostgreSQL and classpath model deployment](decisions/ADR-006-persistence-and-model-deployment.md)
- [ADR-007: Layered testing strategy](decisions/ADR-007-layered-testing-strategy.md)

## How to change a decision

Create a new ADR when a decision changes. Mark the old ADR as `Superseded` and link to the replacement. Do not silently rewrite the rationale for an already accepted decision.

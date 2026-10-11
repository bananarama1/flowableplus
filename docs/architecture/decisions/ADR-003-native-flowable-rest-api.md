# ADR-003: Use the Native Flowable REST API

Status: Accepted
Date: 2026-10-11

## Context

Flowable Enterprise exposes and consumes Flowable REST APIs. Flowable Plus is intentionally a close Flowable OSS extension, so duplicating the native REST surface would add cost without providing value.

## Decision

Embed the Flowable OSS REST modules in the Spring Boot application and expose the native API under:

```text
/flowableplus-api
```

The React UI may consume native Flowable request and response representations directly. Flowable Plus endpoints are added only for Plus-specific behavior that does not exist in Flowable OSS.

## Consequences

- The UI is coupled to the selected Flowable REST contract.
- REST compatibility tests are required for endpoints used by the UI.
- Native Flowable resources remain recognizable and available.
- Authentication and authorization must protect the exposed REST surface.

## Rejected alternative

Wrapping every native Flowable endpoint behind a second Plus API would duplicate the existing API and obscure the project’s intentional Flowable coupling.

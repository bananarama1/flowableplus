# Flowable Plus

Flowable Plus is a Flowable OSS-based workflow application and reusable Spring Boot starter. The project intentionally stays close to Flowable OSS: native Flowable services, configuration, and REST representations are part of the supported platform surface.

## First application slice

The first end-to-end workflow is:

```text
log in
  -> view pre-deployed process definitions
  -> select and start an approval process
  -> view the assigned task
  -> claim the task
  -> complete the task
  -> verify the resulting process state
```

The initial application uses one in-memory username/password user, PostgreSQL, classpath-deployed process models, and Flowable's own persistence schema.

## Cloud handoff smoke test

This marker change verifies the cloud handoff pull-request workflow.

## Architecture

```text
React Work UI
      |
      | session-authenticated HTTP
      v
Spring Boot application
      |
      +-- /flowableplus-api/*  Flowable OSS REST API
      +-- Flowable Plus extensions, when needed
      +-- Flowable BPMN/CMMN/DMN services
      v
PostgreSQL
```

Native Flowable REST responses are intentionally allowed in the UI. Flowable Plus endpoints are added only for functionality that does not belong to the native Flowable API.

## Modules

- `flowableplus-work-core`: shared platform types and core module boundary.
- `flowableplus-work-autoconfigure`: Spring Boot autoconfiguration for Flowable Plus.
- `flowableplus-work-starter`: reusable application dependency.
- `flowableplus-work-integration-tests`: black-box starter and REST integration tests.
- `flowableplus-work-test-models`: stable fixtures for automated tests.
- `flowableplus-work-test-support`: shared Testcontainers infrastructure.
- `flowableplus-example-models`: models used by the runnable example application.
- `flowableplus-example-app`: example Spring Boot consumer.
- `flowableplus-work-ui`: React/Vite Work UI.

## Run locally

See [DEVELOPMENT.md](DEVELOPMENT.md) for Docker Compose, ports, tests, and debugging commands.

## Architecture documentation

The canonical architecture decisions are in [docs/architecture](docs/architecture/README.md). Agent-specific implementation rules are in [.github/copilot-instructions.md](.github/copilot-instructions.md).

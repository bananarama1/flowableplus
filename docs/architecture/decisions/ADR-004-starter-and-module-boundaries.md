# ADR-004: Starter and Module Boundaries

Status: Accepted
Date: 2026-10-11

## Context

The project must provide a reusable Spring Boot starter while retaining realistic example applications and black-box tests.

## Decision

Use these boundaries:

- `flowableplus-work-core`: shared core boundary.
- `flowableplus-work-autoconfigure`: Spring Boot autoconfiguration.
- `flowableplus-work-starter`: reusable application dependency.
- `flowableplus-work-integration-tests`: black-box tests consuming the starter.
- `flowableplus-work-test-models`: stable automated-test process and case fixtures.
- `flowableplus-work-test-support`: shared Testcontainers infrastructure.
- `flowableplus-example-models`: fixtures for the runnable example application.
- `flowableplus-example-app`: a real starter consumer.
- `flowableplus-work-ui`: the React frontend.

## Consequences

- Production modules do not need test-only infrastructure dependencies.
- The starter is tested through the same public dependency boundary used by consumers.
- Example models and minimal test models can evolve independently.
- The example app demonstrates consumption rather than defining the reusable platform.

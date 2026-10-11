# ADR-001: Flowable OSS Foundation

Status: Accepted
Date: 2026-10-11

## Context

Flowable Plus extends Flowable OSS rather than hiding the workflow engine behind an independent abstraction. The project will remain closely coupled to the selected Flowable version.

## Decision

Use Flowable OSS as the core BPMN, CMMN, DMN, identity, persistence, and REST platform. Manage the Flowable version centrally in the root Maven project.

## Consequences

- Native Flowable Java services and configuration remain available.
- Native Flowable REST APIs are part of the supported platform surface.
- Flowable upgrades require intentional compatibility validation.
- Flowable-specific behavior should not be unnecessarily reimplemented in Plus.

## Deferred

Tenant management, external identity providers, and Enterprise-only capabilities are outside the first application version.

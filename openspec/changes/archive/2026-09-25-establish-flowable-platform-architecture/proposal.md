# Proposal

## Why

The repository currently contains a single minimal Spring Boot application with Flowable OSS configured against an in-memory H2 database and only a runtime status endpoint. It does not yet provide a reusable, multi-client platform for authoring Flowable-compatible BPMN/CMMN models, publishing them at runtime, or executing them through a generic work UI.

This change establishes the product boundary and architecture needed to evolve the prototype into one repository containing two independently deployable Spring Boot applications: an IDE-like modeler and a generic work application.

## What Changes

- Establish a Maven multi-module repository structure for a modeler app, work app, shared contracts, and shared Flowable integration code.
- Define model lifecycle behavior for creating, editing, validating, versioning, and publishing BPMN and CMMN definitions.
- Define the runtime publication contract from the modeler app to the work app.
- Establish Flowable OSS as the execution and persistence engine without requiring Flowable Enterprise UI modules.
- Add requirements for an IDE-like modeler frontend with BPMN authoring and CMMN capability.
- Add requirements for a generic work frontend that renders task forms from published metadata and executes process tasks.
- Define client isolation, identity, authorization, deployment, and audit boundaries as explicit architecture decisions.
- Preserve the current status endpoint behavior as a compatibility baseline while the application is decomposed.

## Capabilities

### New Capabilities

- `modeler-platform`: Design-time model management, BPMN/CMMN authoring, validation, versioning, and publication.
- `runtime-publication`: Runtime contract for publishing model definitions from the modeler application to the work application.
- `generic-work-execution`: Process definition discovery, process start, task inbox, generic form rendering, task completion, and basic instance views.
- `platform-foundation`: Repository structure, shared contracts, Flowable OSS integration boundaries, persistence, identity, authorization, and operational conventions.

### Modified Capabilities

None. No existing OpenSpec capabilities are defined in this repository.

## Impact

- Affects the root Maven build and the current single application module.
- Introduces two Spring Boot application boundaries and shared Java contract/library modules.
- Introduces frontend projects for the modeler IDE and generic work UI.
- Expands Flowable usage from a status check to repository, runtime, task, history, and CMMN APIs.
- Requires migration from the current H2-only configuration to a production-capable relational database strategy while retaining a lightweight local profile.
- Adds API, persistence, authorization, publication, and frontend testing requirements.
- The first implementation must resolve whether both applications share a Flowable runtime/database or communicate through a publication and runtime API boundary; the architecture will not silently assume that choice.

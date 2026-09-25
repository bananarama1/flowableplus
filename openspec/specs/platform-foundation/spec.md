# platform-foundation Specification

## Purpose

Establishes the shared platform boundaries that let the modeler and work applications evolve independently while preserving Flowable OSS compatibility, client isolation, security, and operational diagnosability.

## Requirements

### Requirement: The platform SHALL provide two independently deployable application boundaries
The platform SHALL contain a modeler application responsible for design-time concerns and a work application responsible for runtime work execution, with versioned contracts between them.

#### Scenario: Deploy the modeler independently
- **WHEN** a deployment starts only the modeler application and its declared dependencies
- **THEN** the modeler health state is independently observable and its design-time APIs do not require the work UI process to be running

#### Scenario: Deploy the work application independently
- **WHEN** a deployment starts only the work application and its declared dependencies
- **THEN** the work health state is independently observable and its runtime APIs do not require the modeler UI process to be running

### Requirement: The platform SHALL use Flowable OSS for supported runtime execution
The platform SHALL execute supported BPMN and CMMN runtime behavior through Flowable OSS APIs and SHALL not require Flowable Enterprise UI modules for model publication or work execution.

#### Scenario: Execute a published supported definition
- **WHEN** a valid published definition is activated for a client
- **THEN** the runtime uses Flowable-supported repository, case, runtime, task, and history behavior to execute and inspect it

#### Scenario: Report unsupported runtime behavior
- **WHEN** a model uses an engine feature not supported by the configured OSS runtime
- **THEN** publication or activation fails with an actionable compatibility error before the model is offered for execution

### Requirement: The platform SHALL enforce authentication, authorization, and client isolation
All model, publication, runtime, task, and administration operations SHALL authenticate the caller and enforce permissions and client scope before returning data or mutating state.

#### Scenario: Authenticate an application request
- **WHEN** an unauthenticated caller invokes a protected API
- **THEN** the system rejects the request without returning protected model, runtime, task, or client data

#### Scenario: Audit a protected mutation
- **WHEN** an authorized caller publishes a model, starts an instance, or completes a task
- **THEN** the system records the actor, client, operation, target, timestamp, and outcome for audit purposes

### Requirement: The platform SHALL expose operational health and correlation information
Each application SHALL expose health information for its own dependencies and SHALL include a correlation identifier in API responses, logs, and cross-application publication operations.

#### Scenario: Diagnose a dependency failure
- **WHEN** a required database, Flowable engine, or publication dependency is unavailable
- **THEN** the owning application reports a degraded or unavailable health state with a safe diagnostic

#### Scenario: Trace a publication operation
- **WHEN** a model publication crosses the application boundary
- **THEN** the same correlation identifier can be used to relate modeler logs, work-app processing, deployment status, and failure diagnostics

# Spec Delta

## Purpose

Define the documentation contract for the implemented FlowablePlus architecture so operators, developers, and reviewers can identify supported behavior, ownership boundaries, versioning rules, and known limitations without inferring them from source code.

## ADDED Requirements

### Requirement: Platform documentation SHALL define ownership and reuse boundaries
The maintained documentation SHALL identify which concerns are owned by `modeler-app`, `work-app`, `platform-contracts`, and `platform-flowable`, and SHALL distinguish Flowable OSS APIs reused by the platform from platform-owned persistence, authorization, publication, and frontend behavior.

#### Scenario: Review an ownership boundary
- **WHEN** a developer or operator consults the architecture documentation
- **THEN** the document identifies the owning application or shared module for model storage, publication, runtime execution, task behavior, contracts, identity, and frontend assets

#### Scenario: Identify unsupported enterprise dependency
- **WHEN** a reviewer checks the runtime foundation
- **THEN** the documentation states that supported execution does not require Flowable Enterprise UI modules and identifies the adapter boundary used instead

### Requirement: Platform documentation SHALL publish the capability matrix and version policy
The maintained documentation SHALL list first-release BPMN, CMMN, form, assignment, timer, variable, and expression capabilities with an explicit outcome of supported, rejected, or deferred, and SHALL document immutable model versions, active default selection, and running-instance version behavior.

#### Scenario: Determine publication eligibility
- **WHEN** a model author or reviewer checks a capability
- **THEN** the matrix states whether publication supports, rejects, or defers it and identifies the corresponding validation outcome

#### Scenario: Determine runtime version behavior
- **WHEN** an operator needs to activate, supersede, or roll back a model version
- **THEN** the documentation explains the one-active-default policy, immutable published versions, explicit older-version access, and the effect on already-running instances

### Requirement: Platform documentation SHALL define identity and client-runtime isolation
The maintained documentation SHALL describe application-managed identity, client memberships, roles, authorization boundaries, per-client Flowable runtime and database ownership, credential handling, and provisioning behavior.

#### Scenario: Provision a client runtime safely
- **WHEN** an administrator provisions or diagnoses a client runtime
- **THEN** the documentation identifies the server-side registry and migration steps without exposing database credentials through frontend or publication APIs

#### Scenario: Evaluate a cross-client request
- **WHEN** a reviewer examines model, publication, runtime, task, or audit access
- **THEN** the documentation requires authentication, permission checks, and explicit client scope enforcement

### Requirement: Platform documentation SHALL identify known limitations and consistency sources
The documentation SHALL state known limitations, deferred capabilities, deployment assumptions, and the source files or executable checks that define each documented contract. Documentation checks SHALL detect material drift from shared contracts, application configuration, deployment artifacts, and tests.

#### Scenario: Detect documentation drift
- **WHEN** a documented API, configuration key, capability outcome, or deployment boundary changes
- **THEN** the documentation validation process identifies the affected document for update or fails the applicable documentation check

#### Scenario: Distinguish documentation from release approval
- **WHEN** the documentation change is reviewed
- **THEN** it provides evidence links and known limitations but does not claim to replace a human-supervised production release review

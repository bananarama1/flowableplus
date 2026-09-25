# modeler-platform Specification

## Purpose

Provides a reusable, IDE-like design-time workspace for creating, validating, versioning, and publishing Flowable-compatible BPMN and CMMN model definitions for multiple clients.

## Requirements

### Requirement: Modeler SHALL manage client-scoped model projects
The modeler SHALL allow an authorized user to create, inspect, update, and archive model projects within an explicitly identified client scope. Each project SHALL identify its model type, stable key, display name, ownership, and lifecycle state.

#### Scenario: Create a client-scoped model project
- **WHEN** an authorized modeler submits a valid project definition for a client
- **THEN** the system creates a draft project with a stable identifier, model key, model type, and audit metadata

#### Scenario: Reject access to another client project
- **WHEN** a user requests a project outside the user's authorized client scope
- **THEN** the system denies the request without exposing the project's model content or metadata

### Requirement: Modeler SHALL support versioned draft editing
The modeler SHALL preserve immutable published versions and SHALL allow authorized users to create and edit draft versions of BPMN or CMMN model content without changing an already published version.

#### Scenario: Save a new draft version
- **WHEN** an authorized modeler saves valid model content for an existing project
- **THEN** the system stores a new or updated draft version while preserving prior published content

#### Scenario: Prevent mutation of a published version
- **WHEN** a user attempts to edit a published version directly
- **THEN** the system rejects the mutation and directs the user to create a new draft version

### Requirement: Modeler SHALL validate models before publication
The modeler SHALL validate model documents for well-formed content, supported model type, required identifiers, and configured runtime metadata before allowing publication.

#### Scenario: Validate a publishable BPMN model
- **WHEN** a draft BPMN model contains valid identifiers and supported runtime metadata
- **THEN** validation succeeds and the model becomes eligible for publication

#### Scenario: Report validation failures
- **WHEN** a draft model contains malformed content or unsupported runtime metadata
- **THEN** validation fails with actionable errors associated with the affected model element or document rule

### Requirement: Modeler SHALL publish an immutable model version
The modeler SHALL provide an explicit publish action that records the selected model version, publication actor, timestamp, target client, and deployment status. A successful publication SHALL make the model available to the runtime publication contract.

#### Scenario: Publish a validated model
- **WHEN** an authorized modeler publishes a validated draft
- **THEN** the system creates a publication record and exposes the immutable version through the runtime publication contract

#### Scenario: Reject publication of an invalid model
- **WHEN** an authorized modeler attempts to publish a model that has failed validation
- **THEN** the system rejects publication and creates no active runtime publication

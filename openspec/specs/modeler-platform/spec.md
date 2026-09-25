# modeler-platform Specification

## Purpose

Provides a reusable, IDE-like design-time workspace for creating, validating, versioning, and publishing Flowable-compatible BPMN and CMMN model definitions for multiple clients.

## Requirements

### Requirement: Modeler SHALL manage client-scoped model projects
The modeler SHALL provide an authenticated workspace that allows an authorized user to create, inspect, update, archive, and select model projects within an explicitly identified client scope. The workspace SHALL load only the selected client's projects, display each project's model type, stable key, display name, ownership, and lifecycle state, and never expose another client's data.

#### Scenario: Load the client project workspace
- **WHEN** an authenticated modeler opens the workspace for a client
- **THEN** the UI loads only that client's projects and shows an actionable empty state when none exist

#### Scenario: Create and open a project
- **WHEN** an authorized modeler submits a valid project definition
- **THEN** the system creates the client-scoped project, selects it in the workspace, and makes its editable version state available

#### Scenario: Create a client-scoped model project
- **WHEN** an authorized modeler submits a valid project definition for a client
- **THEN** the system creates a draft project with a stable identifier, model key, model type, and audit metadata

#### Scenario: Reject access to another client project
- **WHEN** a user requests a project outside the user's authorized client scope
- **THEN** the system denies the request without exposing the project's model content or metadata and the UI reports a safe authorization error

### Requirement: Modeler SHALL support versioned draft editing
The modeler SHALL load a selected project's versions, open a draft or published version for inspection, and allow authorized users to create a new draft or update the selected editable draft for BPMN or CMMN model content. Published versions SHALL remain immutable, and the workspace SHALL show the resulting version and lifecycle state after a save.

#### Scenario: Open a saved draft
- **WHEN** an authorized modeler selects a project with an editable draft
- **THEN** the editor loads the draft source and the workspace identifies that draft as the selected version

#### Scenario: Save or update a draft
- **WHEN** an authorized modeler saves the current source for a project
- **THEN** the system creates a new draft when no editable version is selected or updates the selected draft, and the UI reports the saved version

#### Scenario: Save a new draft version
- **WHEN** an authorized modeler saves valid model content for an existing project
- **THEN** the system stores a new or updated draft version while preserving prior published content

#### Scenario: Prevent mutation of a published version
- **WHEN** a user attempts to save changes while a published version is selected
- **THEN** the system rejects the mutation and the UI directs the user to create or select a new draft without changing the published content

### Requirement: Modeler SHALL validate models before publication
The modeler SHALL validate the currently selected version against its model type and runtime metadata, display actionable validation errors, and retain the validation result for the publish decision. A missing project or version context SHALL not be presented as a successful server validation.

#### Scenario: Validate the selected draft
- **WHEN** an authorized modeler selects Validate for an editable BPMN or CMMN draft
- **THEN** the UI sends the selected client and version context, displays the returned result, and marks the draft eligible for publication only when validation succeeds

#### Scenario: Validate a publishable BPMN model
- **WHEN** a draft BPMN model contains valid identifiers and supported runtime metadata
- **THEN** validation succeeds and the model becomes eligible for publication

#### Scenario: Report validation failures
- **WHEN** a draft model contains malformed content or unsupported runtime metadata
- **THEN** validation fails with actionable errors associated with the affected model element or document rule

#### Scenario: Display validation failures in the workspace
- **WHEN** validation finds malformed content, missing identifiers, or unsupported metadata
- **THEN** the UI displays the structured failure message and leaves publication disabled

### Requirement: Modeler SHALL publish an immutable model version
The modeler SHALL expose publication only for an explicitly selected, successfully validated version, send the authenticated publication request with its client and correlation context, and record the selected model version, publication actor, timestamp, target client, and deployment status. The UI SHALL display active, failed, and transport-failure outcomes without falsely marking a local version as published. A successful publication SHALL make the model available to the runtime publication contract.

#### Scenario: Publish a validated selected version
- **WHEN** an authorized modeler publishes a validated draft
- **THEN** the system records the publication result for the selected immutable version and the UI displays its status and correlation identifier

#### Scenario: Publish a validated model
- **WHEN** an authorized modeler publishes a validated draft
- **THEN** the system creates a publication record and exposes the immutable version through the runtime publication contract

#### Scenario: Block publication without valid context
- **WHEN** a user tries to publish before validation succeeds or without a selected client/version
- **THEN** the UI prevents the request and explains what context is missing

#### Scenario: Reject publication of an invalid model
- **WHEN** an authorized modeler attempts to publish a model that has failed validation
- **THEN** the system rejects publication and creates no active runtime publication

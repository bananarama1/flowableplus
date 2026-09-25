# generic-work-execution Specification

## Purpose

Provides a process-agnostic work experience that discovers published definitions, starts process instances, renders task forms from metadata, and lets authorized users complete assigned work.

## Requirements

### Requirement: Work application SHALL expose active process definitions
The work application SHALL list active process definitions available to the requesting user's client scope, including model key, version, model type, display name, and startability information.

#### Scenario: List active process definitions
- **WHEN** an authorized user requests the process catalog
- **THEN** the system returns only active definitions available to that user's client scope

#### Scenario: Hide superseded definitions
- **WHEN** a newer active version supersedes an older startable version
- **THEN** the catalog marks the older version according to the version policy and does not offer it as the default start option

### Requirement: Work application SHALL start and inspect process instances
The work application SHALL allow an authorized user to start an available BPMN process instance with validated initial variables and SHALL provide instance status and history needed by the work UI.

#### Scenario: Start a process instance
- **WHEN** a user starts an available process with valid initial variables
- **THEN** the system creates a process instance associated with the selected definition and returns its identifier and initial state

#### Scenario: Reject invalid start variables
- **WHEN** a user starts a process with variables that violate the published input metadata
- **THEN** the system rejects the request with field-level errors and creates no process instance

### Requirement: Work application SHALL provide an authorized task inbox
The work application SHALL list tasks assigned to the current user or to groups available to the user, with process instance, task definition, due state, and form metadata references.

#### Scenario: List user tasks
- **WHEN** an authorized user opens the inbox
- **THEN** the system returns only tasks the user may claim, view, or complete according to assignment and client scope

#### Scenario: Prevent cross-client task access
- **WHEN** a user requests a task belonging to another client scope
- **THEN** the system denies access and does not return task variables or form metadata

### Requirement: Work application SHALL render and submit generic task forms
The work UI SHALL render a task form from published schema and metadata without requiring process-specific frontend code, and the backend SHALL validate submitted values before completing the task.

#### Scenario: Render a supported task form
- **WHEN** a task references a supported form schema
- **THEN** the work UI renders the fields, labels, required constraints, and current values described by the schema

#### Scenario: Complete a task with valid values
- **WHEN** an authorized user submits values satisfying the task form constraints
- **THEN** the system persists the values, completes the task, and returns the next available state

#### Scenario: Reject invalid task values
- **WHEN** submitted values violate a required, type, or business validation rule
- **THEN** the system returns field-level validation errors and leaves the task active

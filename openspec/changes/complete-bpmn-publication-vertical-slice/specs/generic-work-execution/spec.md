# Spec Delta

## MODIFIED Requirements

### Requirement: Work application SHALL expose active process definitions
The work application SHALL list active BPMN process definitions available to the requesting user's client scope, including model key, version, model type, display name, startability, and form metadata references. Superseded versions SHALL not be offered as the normal default start option.

#### Scenario: List the published BPMN catalog
- **WHEN** an authorized user opens the work catalog for a client after BPMN publication
- **THEN** the catalog contains the active definition for that client and does not contain another client's definition

#### Scenario: List active process definitions
- **WHEN** an authorized user requests the process catalog
- **THEN** the system returns only active definitions available to that user's client scope

#### Scenario: Hide superseded definitions
- **WHEN** a newer active version supersedes an older startable version
- **THEN** the catalog marks the older version according to the version policy and does not offer it as the default start option

### Requirement: Work application SHALL start and inspect process instances
The work application SHALL start a published BPMN process with validated initial variables and provide the instance identifier, active state, selected model version, and history needed by the work UI.

#### Scenario: Start the published BPMN process
- **WHEN** an authorized user starts an active BPMN definition with valid initial variables
- **THEN** Flowable creates a process instance for the selected client and version and the API returns its identifier and initial state

#### Scenario: Start a process instance
- **WHEN** a user starts an available process with valid initial variables
- **THEN** the system creates a process instance associated with the selected definition and returns its identifier and initial state

#### Scenario: Reject invalid BPMN start variables
- **WHEN** initial variables violate the published input metadata
- **THEN** the API returns field-level errors and creates no process instance

#### Scenario: Reject invalid start variables
- **WHEN** a user starts a process with variables that violate the published input metadata
- **THEN** the system rejects the request with field-level errors and creates no process instance

### Requirement: Work application SHALL render and submit generic task forms
The work UI SHALL render the published BPMN user-task form without process-specific frontend code, and the backend SHALL validate submitted values before completing the task.

#### Scenario: Complete a published BPMN user task
- **WHEN** an authorized user submits values satisfying the task form schema
- **THEN** the values are persisted, the task completes, and the API returns the next available state

#### Scenario: Render a supported task form
- **WHEN** a task references a supported form schema
- **THEN** the work UI renders the fields, labels, required constraints, and current values described by the schema

#### Scenario: Complete a task with valid values
- **WHEN** an authorized user submits values satisfying the task form constraints
- **THEN** the system persists the values, completes the task, and returns the next available state

#### Scenario: Reject invalid BPMN task values
- **WHEN** submitted task values violate required, type, or business validation
- **THEN** the API returns field-level errors and leaves the task active

#### Scenario: Reject invalid task values
- **WHEN** submitted values violate a required, type, or business validation rule
- **THEN** the system returns field-level validation errors and leaves the task active
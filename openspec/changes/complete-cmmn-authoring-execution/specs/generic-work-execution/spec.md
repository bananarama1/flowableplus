# Spec Delta

## MODIFIED Requirements

### Requirement: Work application SHALL expose active process definitions
The work application SHALL expose active CMMN case definitions in the client-scoped catalog with model key, version, model type, display name, startability, and supported start metadata. Superseded case versions SHALL not be offered as the normal default.

#### Scenario: List an active CMMN case definition
- **WHEN** an authorized user opens the catalog for a client with a published CMMN case
- **THEN** the catalog returns the active case definition for that client and does not reveal definitions from another client

#### Scenario: List active process definitions
- **WHEN** an authorized user requests the process catalog
- **THEN** the system returns only active definitions available to that user's client scope

#### Scenario: Hide superseded definitions
- **WHEN** a newer active version supersedes an older startable version
- **THEN** the catalog marks the older version according to the version policy and does not offer it as the default start option

## ADDED Requirements

### Requirement: Work application SHALL start and inspect supported CMMN cases
The work application SHALL allow an authorized user to start a published supported CMMN case with validated initial variables and SHALL provide case instance status and history for the selected client and version.

#### Scenario: Start a published CMMN case
- **WHEN** an authorized user starts an active CMMN case with valid initial variables
- **THEN** the runtime creates a case instance for the target client and returns its identifier, selected version, and initial state

#### Scenario: Reject invalid CMMN start variables
- **WHEN** initial variables violate the published CMMN input metadata
- **THEN** the API returns field-level errors and creates no case instance

#### Scenario: Inspect CMMN case history
- **WHEN** an authorized user requests a case instance belonging to the same client
- **THEN** the API returns current case state and history without exposing another client's variables or metadata
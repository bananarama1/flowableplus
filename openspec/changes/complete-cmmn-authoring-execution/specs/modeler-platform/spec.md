# Spec Delta

## MODIFIED Requirements

### Requirement: Modeler SHALL support versioned draft editing
The modeler SHALL provide a constrained CMMN authoring surface for stages, human tasks, sentries, milestones, supported timers, case variables, and user/group assignments. Editing SHALL update the selected draft source and preserve unknown CMMN and Flowable extension elements and attributes during round trips.

#### Scenario: Add an approved CMMN element
- **WHEN** an authorized modeler adds an approved CMMN element to an editable case draft
- **THEN** the element appears in the constrained authoring surface with a stable identifier and the exported source contains it

#### Scenario: Save a new draft version
- **WHEN** an authorized modeler saves valid model content for an existing project
- **THEN** the system stores a new or updated draft version while preserving prior published content

#### Scenario: Prevent mutation of a published version
- **WHEN** a user attempts to edit a published version directly
- **THEN** the system rejects the mutation and directs the user to create a new draft version

#### Scenario: Preserve unknown CMMN extensions
- **WHEN** a CMMN draft contains an extension the editor does not expose
- **THEN** importing, editing a known element, and exporting the draft preserves the unknown extension data

### Requirement: Modeler SHALL validate models before publication
The modeler SHALL validate CMMN case identifiers, supported element constructs, sentry/timer constraints, variable and assignment metadata, and form metadata before enabling publication. Unsupported discretionary items and event listeners SHALL be rejected or remain explicitly deferred.

#### Scenario: Validate a supported CMMN case
- **WHEN** an authorized modeler validates a CMMN draft containing only approved constructs and valid metadata
- **THEN** validation succeeds and the case becomes eligible for publication

#### Scenario: Validate a publishable BPMN model
- **WHEN** a draft BPMN model contains valid identifiers and supported runtime metadata
- **THEN** validation succeeds and the model becomes eligible for publication

#### Scenario: Reject unsupported CMMN constructs
- **WHEN** a CMMN draft contains a missing case identifier, unsupported event listener, discretionary item, or invalid variable metadata
- **THEN** validation returns actionable structured errors and publication remains disabled

#### Scenario: Report validation failures
- **WHEN** a draft model contains malformed content or unsupported runtime metadata
- **THEN** validation fails with actionable errors associated with the affected model element or document rule
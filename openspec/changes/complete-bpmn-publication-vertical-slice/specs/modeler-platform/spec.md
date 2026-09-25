# Spec Delta

## MODIFIED Requirements

### Requirement: Modeler SHALL validate models before publication
For BPMN drafts, the modeler SHALL validate the selected version using the server-side capability and form-metadata rules before enabling publication. Validation SHALL include the client, version, model type, correlation identifier, and the current persisted source rather than an unrelated local sample.

#### Scenario: Validate a publishable BPMN draft
- **WHEN** an authorized modeler validates a selected BPMN draft with a required process identifier and supported metadata
- **THEN** validation succeeds, returns normalized metadata, and makes that version eligible for publication

#### Scenario: Validate a publishable BPMN model
- **WHEN** a draft BPMN model contains valid identifiers and supported runtime metadata
- **THEN** validation succeeds and the model becomes eligible for publication

#### Scenario: Reject an unsupported BPMN draft
- **WHEN** a BPMN draft contains malformed XML, a missing process identifier, an unsupported gateway/event, or invalid form metadata
- **THEN** validation returns structured errors and the modeler keeps publication disabled

#### Scenario: Report validation failures
- **WHEN** a draft model contains malformed content or unsupported runtime metadata
- **THEN** validation fails with actionable errors associated with the affected model element or document rule

### Requirement: Modeler SHALL publish an immutable model version
The modeler SHALL publish the selected validated BPMN version through the authenticated runtime publication contract, display the returned active or failed state and correlation identifier, and leave the local version unpublished when transport or activation fails.

#### Scenario: Publish a BPMN draft into the client runtime
- **WHEN** an authorized modeler publishes a validated BPMN draft
- **THEN** the modeler sends the immutable envelope with authorization, client identity, correlation identifier, and actor context, and records the active publication result

#### Scenario: Publish a validated model
- **WHEN** an authorized modeler publishes a validated draft
- **THEN** the system creates a publication record and exposes the immutable version through the runtime publication contract

#### Scenario: Keep the active version on publication failure
- **WHEN** publication times out, is unauthorized, or the work runtime rejects the BPMN definition
- **THEN** the modeler displays a safe failure, does not mark the local version published, and the prior active runtime version remains available

#### Scenario: Reject publication of an invalid model
- **WHEN** an authorized modeler attempts to publish a model that has failed validation
- **THEN** the system rejects publication and creates no active runtime publication
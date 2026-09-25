# Spec Delta

## MODIFIED Requirements

### Requirement: Publication SHALL carry a complete immutable model envelope
A BPMN publication SHALL carry client scope, stable model identity, immutable version number, BPMN content, form metadata, actor, correlation identifier, and an idempotency key that identifies the client/model/version publication attempt. The receiving runtime SHALL validate the envelope before deployment.

#### Scenario: Accept a complete BPMN publication
- **WHEN** the authenticated modeler sends a complete validated BPMN envelope
- **THEN** the work application records the request, deploys the definition for the target client, and returns an active result with a runtime reference

#### Scenario: Accept a complete publication
- **WHEN** the modeler sends a valid publication envelope for a validated model version
- **THEN** the receiving runtime accepts it, records the correlation identifier, and makes the publication status queryable

#### Scenario: Reject an incomplete BPMN publication
- **WHEN** a publication omits client identity, version, content, model type, or required metadata
- **THEN** the work application returns a structured error and creates no active deployment

#### Scenario: Reject an incomplete publication
- **WHEN** a publication omits a required identity, version, content, or metadata field
- **THEN** the receiving runtime rejects it with a structured validation error and does not activate the model

### Requirement: Publication SHALL be idempotent
Repeated BPMN publication requests for the same client, model key, immutable version, and idempotency key SHALL return the existing logical result without creating another active deployment.

#### Scenario: Receive a duplicate BPMN publication
- **WHEN** the work application receives the same BPMN publication more than once
- **THEN** it returns the existing publication result and Flowable contains no duplicate active deployment for that request

#### Scenario: Receive a duplicate publication
- **WHEN** the work app receives repeated requests for the same client, model version, and idempotency key
- **THEN** it returns the existing publication result without creating a duplicate deployment

### Requirement: Publication SHALL protect client boundaries
The publication boundary SHALL authenticate the modeler caller and verify that the caller may publish into the envelope's client scope before validating or activating the BPMN definition.

#### Scenario: Reject cross-client BPMN publication
- **WHEN** an authenticated caller submits a BPMN envelope for a client outside its permissions
- **THEN** the work application rejects the request and creates no deployment or active publication record

#### Scenario: Authorized model publication
- **WHEN** an authenticated modeler with publish permission submits a client-scoped model
- **THEN** the runtime accepts the publication for that client

#### Scenario: Unauthorized cross-client publication
- **WHEN** a caller attempts to publish a model into a client scope it cannot administer
- **THEN** the request is rejected and no runtime deployment is created
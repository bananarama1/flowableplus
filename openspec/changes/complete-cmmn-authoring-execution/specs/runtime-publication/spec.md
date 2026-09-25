# Spec Delta

## MODIFIED Requirements

### Requirement: Publication SHALL carry a complete immutable model envelope
A CMMN publication SHALL identify the client, stable case model key, CMMN model type, immutable version, source document, supported case metadata, actor, correlation identifier, and idempotency key. The receiving runtime SHALL validate the envelope and the CMMN compatibility matrix before activation.

#### Scenario: Accept a complete CMMN publication
- **WHEN** the authenticated modeler sends a validated CMMN envelope for an approved case definition
- **THEN** the work application records the request, creates the client-scoped case deployment, and returns an active runtime reference

#### Scenario: Accept a complete publication
- **WHEN** the modeler sends a valid publication envelope for a validated model version
- **THEN** the receiving runtime accepts it, records the correlation identifier, and makes the publication status queryable

#### Scenario: Reject an unsupported CMMN publication
- **WHEN** a CMMN envelope contains an unsupported construct or incomplete required metadata
- **THEN** the work application returns a structured compatibility error and leaves the previous active case definition unchanged

#### Scenario: Reject an incomplete publication
- **WHEN** a publication omits a required identity, version, content, or metadata field
- **THEN** the receiving runtime rejects it with a structured validation error and does not activate the model

### Requirement: Publication SHALL be idempotent
Repeated CMMN publication requests for the same client, case model key, immutable version, and idempotency key SHALL return the existing logical result without creating duplicate active case deployments.

#### Scenario: Receive a duplicate CMMN publication
- **WHEN** the work application receives the same CMMN publication more than once
- **THEN** it returns the original result and does not create a second active case deployment

#### Scenario: Receive a duplicate publication
- **WHEN** the work app receives repeated requests for the same client, model version, and idempotency key
- **THEN** it returns the existing publication result without creating a duplicate deployment

### Requirement: Publication SHALL protect client boundaries
The CMMN publication boundary SHALL authenticate the caller and authorize the target client before accepting, deploying, or activating a case definition.

#### Scenario: Reject cross-client CMMN publication
- **WHEN** an authenticated caller submits a CMMN envelope for an unauthorized client
- **THEN** the request is rejected and no case deployment or active publication is created

#### Scenario: Authorized model publication
- **WHEN** an authenticated modeler with publish permission submits a client-scoped model
- **THEN** the runtime accepts the publication for that client

#### Scenario: Unauthorized cross-client publication
- **WHEN** a caller attempts to publish a model into a client scope it cannot administer
- **THEN** the request is rejected and no runtime deployment is created
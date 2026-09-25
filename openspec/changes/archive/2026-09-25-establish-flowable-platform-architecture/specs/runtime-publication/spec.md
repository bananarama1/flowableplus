# Spec Delta

## Purpose

Defines the reliable boundary by which the modeler makes validated BPMN and CMMN definitions available to the work application and Flowable runtime without requiring manual copying or configuration.

## ADDED Requirements

### Requirement: Publication SHALL carry a complete immutable model envelope
A publication SHALL identify the client, model key, model type, immutable version, content or deployment reference, runtime metadata, publication status, and correlation identifier needed for idempotent processing.

#### Scenario: Accept a complete publication
- **WHEN** the modeler sends a valid publication envelope for a validated model version
- **THEN** the receiving runtime accepts it, records the correlation identifier, and makes the publication status queryable

#### Scenario: Reject an incomplete publication
- **WHEN** a publication omits a required identity, version, content, or metadata field
- **THEN** the receiving runtime rejects it with a structured validation error and does not activate the model

### Requirement: Publication SHALL be idempotent
The publication boundary SHALL treat repeated requests for the same client, model version, and correlation identifier as one logical publication and SHALL not create duplicate active deployments.

#### Scenario: Receive a duplicate publication
- **WHEN** the work app receives repeated requests for the same client, model version, and idempotency key
- **THEN** it returns the existing publication result without creating a duplicate deployment

### Requirement: Publication SHALL expose lifecycle status
The modeler and work applications SHALL expose publication states sufficient to distinguish accepted, validating, active, failed, and superseded versions, including failure details when activation fails.

#### Scenario: Query a successful publication
- **WHEN** a client requests the status of a publication that was activated
- **THEN** the system returns its active state, runtime deployment reference, and model version

#### Scenario: Query a failed publication
- **WHEN** activation fails due to an invalid or unsupported runtime definition
- **THEN** the system returns a failed state with a safe diagnostic and keeps the previous active version unchanged

#### Scenario: Publication transport failure
- **WHEN** the modeler cannot receive a response because of timeout or connection failure
- **THEN** the modeler displays a publication error and does not mark the local version as published; the work app remains responsible for committing or rolling back its own transaction

### Requirement: Publication SHALL protect client boundaries
The publication boundary SHALL authenticate callers and SHALL verify that the caller is authorized to publish into the target client scope before accepting or activating a model.

#### Scenario: Authorized model publication
- **WHEN** an authenticated modeler with publish permission submits a client-scoped model
- **THEN** the runtime accepts the publication for that client

#### Scenario: Unauthorized cross-client publication
- **WHEN** a caller attempts to publish a model into a client scope it cannot administer
- **THEN** the request is rejected and no runtime deployment is created

# Proposal

## Why

CMMN is represented in the modeler by a constrained source-editing notice and a moddle round trip, but it is not yet a dependable authoring and runtime story. Users need a supported way to create the declared CMMN elements, validate them, publish them, start a case, and inspect its state without relying on undocumented XML edits.

## What Changes

- Replace the placeholder CMMN interaction with a constrained authoring workflow for the approved element set.
- Preserve supported and unknown CMMN extension data during import, editing, and export.
- Validate CMMN identifiers, supported constructs, variables, assignments, timers, and publication metadata before activation.
- Extend the publication path to accept and activate supported CMMN case definitions with client isolation and idempotency.
- Complete case catalog, case start, case history, and failure behavior in the work application.
- Add representative browser, round-trip, contract, and Flowable integration tests for CMMN.

## Capabilities

### New Capabilities

### Modified Capabilities
- `modeler-platform`: Make the constrained CMMN authoring and validation surface functional.
- `runtime-publication`: Support the declared CMMN publication lifecycle and compatibility failures.
- `generic-work-execution`: Support client-scoped CMMN case discovery, start, and status inspection.

## Impact

- Affects `modeler-app/frontend`, model validation and publication services, `work-app` CMMN runtime adapters and APIs, shared contracts, and integration tests.
- Depends on the workspace selection/authentication behavior from `complete-modeler-workspace` and the publication/runtime boundary proven by `complete-bpmn-publication-vertical-slice`.
- The scope remains limited to the approved CMMN capability matrix; unsupported Flowable features remain rejected or deferred.
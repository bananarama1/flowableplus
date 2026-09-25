# Proposal

## Why

The repository has model validation, publication contracts, Flowable runtime APIs, and a generic work shell, but the BPMN user journey is not yet proven from an authenticated modeler draft through an active runtime definition and completed task. The missing integration leaves the central product promise dependent on manual setup and hides failures between applications.

## What Changes

- Complete the authenticated BPMN draft, validation, and publication flow from the modeler UI.
- Connect publication to the work application with the shared envelope, correlation identifier, authorization, and idempotency behavior.
- Ensure a successfully published BPMN definition appears in the client-scoped work catalog and can start a process instance.
- Render the published task form, validate task input, complete the task, and expose the resulting instance state.
- Preserve the previous active version when validation, transport, authorization, or runtime activation fails.
- Add contract, integration, and browser evidence for the complete BPMN path and cross-client rejection cases.

## Capabilities

### New Capabilities

### Modified Capabilities
- `modeler-platform`: Complete authenticated BPMN validation and publication controls for a selected draft version.
- `runtime-publication`: Complete authenticated, idempotent BPMN publication and lifecycle status behavior.
- `generic-work-execution`: Complete the BPMN catalog, start, task form, task completion, and instance inspection path.

## Impact

- Affects `modeler-app`, `work-app`, `platform-contracts`, `platform-flowable`, publication persistence, authentication, and frontend browser tests.
- Requires a runnable local modeler/work-app integration with a client-scoped Flowable runtime.
- Depends on the selected project/version state delivered by `complete-modeler-workspace`.
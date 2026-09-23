# Modeler IDE Interaction Baseline

The first-release modeler keeps the IDE interaction model intentionally simple.

## Unsaved changes

- Editing changes the in-memory model.
- The user explicitly selects **Save draft** to persist the current model.
- Saving exports the current BPMN or CMMN source and creates or updates the draft version through the modeler API.
- The status area reports `Draft saved` or `Draft could not be saved`.
- There is no automatic save or navigation warning in this release.

## Out of scope

Concurrent editing, conflict resolution, keyboard shortcut policy, and model recovery are deferred. The modeler does not claim to detect or resolve those conditions yet.

The frontend acceptance test verifies the Save draft control and its persistence request contract.
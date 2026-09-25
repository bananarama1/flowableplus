# Proposal

## Why

The modeler page currently presents an IDE-like shell, but most of its projects, tabs, properties, and version history are static markup. The editor can round-trip a local sample model, yet a user cannot reliably open a client-scoped project, load a saved version, update an existing draft, or use the authenticated modeler workflow end to end.

## What Changes

- Connect the modeler workspace to client-scoped project and version APIs.
- Make project creation, project selection, model tabs, version selection, and draft loading observable UI workflows.
- Track the selected project and version so saving creates a draft or updates the current editable draft without mutating a published version.
- Make the properties/source area reflect the selected model and report save, authorization, and load failures.
- Propagate the authenticated user context for protected modeler operations and preserve client isolation.
- Add focused browser and backend acceptance coverage for the workspace and draft lifecycle.

## Capabilities

### New Capabilities

### Modified Capabilities
- `modeler-platform`: Make the modeler workspace and versioned draft editing behavior functional rather than static.

## Impact

- Affects `modeler-app` model APIs, persistence interactions, authentication integration, static modeler HTML/JavaScript, and frontend browser tests.
- May add API response fields or endpoints needed to load the current project/version state; existing client and version authorization rules remain in force.
- Establishes the selected-project/version state that the later BPMN publication slice will consume.
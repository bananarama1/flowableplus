# Design

## Context

The current modeler shell in `modeler-app/src/main/resources/static/index.html` contains sample project, tab, property, and version markup. `modeler.js` reads optional query parameters and can save, validate, or publish only when callers provide the required identifiers; it does not hydrate or maintain workspace state. The editor bundle already exposes BPMN/CMMN import and XML export, while the modeler services already enforce client-scoped project/version lookup.

## Goals / Non-Goals

**Goals:**

- Establish one workspace state model for client, project, version, editor type, source, validation, and publication status.
- Replace sample navigation and metadata with API-backed rendering while preserving the existing visual shell.
- Support draft creation versus editable-draft update and preserve published-version immutability.
- Propagate the local bearer token through modeler API requests and provide safe, visible failure states.
- Leave the later BPMN publication and CMMN runtime behavior to their dedicated changes.

**Non-Goals:**

- Adding collaborative editing, conflict resolution, autosave, or recovery beyond the documented explicit-save behavior.
- Building a general form designer or exposing unsupported Flowable properties.
- Changing the publication envelope or work runtime contract.

## Decisions

### 1. Use URL state plus a single client-side workspace controller

Keep `clientId`, `projectId`, and `versionId` as navigable URL state, but make the URL the result of selection rather than the only input. A workspace controller loads projects and versions, updates the URL with `history.replaceState`, and renders the selected state into the existing sidebar, tabs, properties, version list, and status regions.

Alternative considered: keep hard-coded markup and add isolated click handlers. Rejected because it cannot represent newly created projects or server-side version state consistently.

### 2. Centralize authenticated API requests

Use one fetch wrapper that adds JSON headers, the locally configured bearer token, and correlation identifiers where required. The wrapper must distinguish authentication failure, authorization failure, not-found, validation failure, and transport failure so the UI can provide safe messages without exposing response internals.

Alternative considered: pass tokens through query parameters. Rejected because URLs are logged and shared more broadly than request headers.

### 3. Treat the selected version as the save authority

If the selected version is an editable draft, save through the draft update operation. If no editable version exists, create a new draft and replace the workspace version selection with the returned record. Published versions remain read-only and require a new draft flow before editing.

Alternative considered: always create a new version on Save draft. Rejected because repeated saves would create unnecessary drafts and would not satisfy the existing editable-draft contract.

### 4. Keep editor XML as the source of truth

The workspace asks `FlowablePlusEditor.exportCurrent()` for the source before save and imports the server-selected XML before editing. Properties and version metadata are projections of the selected model state; they must not silently replace source XML or discard extensions.

## Risks / Trade-offs

- **Legacy sample markup leaks into the UI:** render or replace sample nodes from one controller and add browser assertions that no hard-coded project remains after load.
- **Token expiry during editing:** preserve unsaved in-memory source, show a sign-in/authorization state, and do not reset the editor on a failed request.
- **Published version selection is ambiguous:** make the read-only state explicit and provide a separate create-draft action before enabling editing.
- **URL state becomes stale after save:** update the URL and version history from the server response, then reload the selected version list.
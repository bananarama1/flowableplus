# Tasks

## 1. Workspace state and API integration

- [x] 1.1 Define the client/project/version workspace state and URL synchronization, and verify selection changes update the rendered context and query parameters.
- [x] 1.2 Load client-scoped projects and project versions through the modeler APIs, and verify empty, loading, not-found, and cross-client responses are handled without sample data leaking into the UI.
- [x] 1.3 Implement project creation and selection, and verify a created project appears selected with its model type, key, display name, and initial version state.

## 2. Editor and draft lifecycle

- [x] 2.1 Import the selected BPMN or CMMN version into the editor and bind source, properties, tabs, and version history to the selected server record; verify a saved fixture opens with the correct type and XML.
- [x] 2.2 Implement Save draft branching between create-draft and update-draft operations, and verify the returned version replaces stale local state without creating duplicate versions on repeated saves.
- [x] 2.3 Make published versions read-only and add the create/select-draft transition, and verify a direct published-version mutation is rejected while published XML remains unchanged.
- [x] 2.4 Render structured validation, save, authorization, and transport outcomes in the existing status regions, and verify unsaved editor source is retained after a failed request.

## 3. Authentication and acceptance evidence

- [x] 3.1 Centralize modeler fetch authentication and correlation headers using the local bearer-token contract, and verify protected modeler requests reject missing or expired credentials without putting tokens in URLs.
- [x] 3.2 Add backend tests for client-scoped project/version reads, draft updates, published-version mutation rejection, and project creation, and verify the negative client-isolation cases return safe errors.
- [x] 3.3 Add modeler browser tests for project loading, draft opening, save/update, published read-only state, and responsive layout, and verify the tests run against a deterministic local profile.
- [x] 3.4 Run the modeler Maven tests and frontend build/browser suite, and verify no unrelated application source or publication contract behavior changed.
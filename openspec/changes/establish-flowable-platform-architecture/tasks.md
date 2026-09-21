# Tasks

## 1. Architecture decisions and compatibility spike

- [x] 1.1 Record the approved baseline decisions in repository documentation: two Spring Boot applications, modeler-owned design time, work-app-owned runtime, app-managed identity, one Flowable runtime per client, full CMMN scope, one active default version, and backend-served frontend assets; verify the decision record is reviewable by the human developer.
- [x] 1.2 Verify the configured Java, Spring Boot, Flowable OSS, Maven, and frontend toolchain combination with a minimal boot/deploy test; verify both a BPMN definition and a representative CMMN case can be deployed or report the exact unsupported combination before module implementation begins.
- [x] 1.3 Define the first-release BPMN/CMMN capability matrix, including supported model elements, form metadata, assignments, timers, variables, and unsupported features; verify every item has a publish-time outcome of supported, rejected, or explicitly deferred.

## 2. Repository and shared contract foundation

- [x] 2.1 Convert the current single-module Maven build into modules for `platform-contracts`, `platform-flowable`, `modeler-app`, and `work-app` without changing the existing status endpoint behavior; verify the full Maven build and current tests pass.
- [x] 2.2 Define shared Java contracts for client scope, model identity, model version, BPMN/CMMN document payloads, publication envelope, publication status, runtime definition, task, form schema, and structured errors; verify serialization round trips with contract tests.
- [x] 2.3 Define API compatibility and correlation-id conventions for modeler-to-work publication; verify duplicate request and malformed request examples are represented in executable contract tests.
- [x] 2.4 Establish shared configuration naming, profile conventions, logging fields, and health response conventions; verify each application can expose an independent health response in a local profile.

## 3. Per-client runtime and Flowable adapter

- [x] 3.1 Implement the client-runtime registry model and provisioning interface without exposing database credentials to frontend or publication callers; verify a client resolves to exactly one configured runtime target and unknown clients fail closed.
- [x] 3.2 Implement the Flowable adapter boundary for repository deployment, BPMN runtime, CMMN case runtime, user tasks, variables, and history queries; verify adapter tests use real Flowable services rather than controller mocks.
- [x] 3.3 Configure a separate Flowable schema/database per client with migration support and a local test profile; verify two clients can deploy definitions with identical keys without cross-client visibility.
- [x] 3.4 Preserve or replace the current Flowable status endpoint with equivalent runtime health behavior; verify the endpoint reports dependency failure safely and includes a correlation identifier.

## 4. Modeler persistence and model lifecycle backend

- [x] 4.1 Implement model project persistence scoped by client, model key, model type, owner, and lifecycle state; verify authorized reads never return another client's project data.
- [x] 4.2 Implement immutable published versions and editable drafts for BPMN and CMMN documents; verify editing a published version is rejected and a new draft preserves the published content.
- [x] 4.3 Implement XML parsing, normalized metadata extraction, extension metadata validation, and the initial BPMN/CMMN capability matrix checks; verify malformed XML, missing identifiers, unsupported constructs, and invalid form metadata produce actionable errors.
- [x] 4.4 Implement publication records with actor, client, version, timestamp, status, runtime reference, failure details, and correlation id; verify failed publication leaves the previous active version unchanged.
- [x] 4.5 Clarify the exact metadata and form-schema fields required by the first process examples, including supported controls, variable types, assignment rules, and start inputs; verify the finalized schema is versioned and documented before frontend form work starts.

## 5. Work application runtime API

- [x] 5.1 Implement publication intake in the work app with authentication, client-runtime resolution, envelope validation, and idempotency; verify retries return the existing result and do not create duplicate Flowable deployments.
- [x] 5.2 Implement runtime compatibility validation and activation for BPMN and CMMN definitions; verify unsupported definitions are rejected with safe diagnostics and the previous active version remains active.
- [x] 5.3 Implement active definition catalog APIs with model key, type, version, display name, startability, and client scope; verify only one configured active default version is offered for normal starts.
- [x] 5.4 Implement process start, CMMN case start, process/case detail, task inbox, task detail, and history APIs; verify real Flowable integration tests cover successful execution and client-isolation failures.
- [x] 5.5 Implement generic form metadata retrieval and task completion with server-side required/type/business validation; verify invalid submissions leave tasks active and valid submissions persist variables and complete tasks.
- [x] 5.6 Clarify the first-release runtime API pagination, sorting, filtering, and history retention rules; verify the API contract documents stable behavior for empty, large, and unauthorized result sets.

## 6. Application-managed identity and authorization

- [x] 6.1 Implement application-managed users, client memberships, roles, and permission assignments with password/session or token handling selected by the human developer; verify protected endpoints reject unauthenticated requests.
- [x] 6.2 Implement authorization policies for model editing, validation, publication, process/case start, task view, task claim, and task completion; verify positive and negative tests for each operation and client boundary.
- [x] 6.3 Implement audit events for model mutations, publications, starts, claims, completions, and authorization failures; verify each event contains actor, client, target, timestamp, operation, outcome, and correlation id.
- [x] 6.4 Clarify the initial user provisioning and credential recovery workflow; verify the chosen workflow is documented and does not require manual database edits in normal operation.

## 7. Modeler frontend IDE

- [x] 7.1 Create the modeler frontend shell with client/project navigation, model tabs, editor canvas, properties panel, validation output, version history, and publication status; verify the shell loads through the modeler Spring Boot application.
- [x] 7.2 Integrate BPMN editing, palette configuration, Flowable-compatible properties, assignment metadata, variables, and form references; verify a representative model can be opened, edited, saved, and round-tripped without losing supported XML or metadata.
- [x] 7.3 Integrate CMMN authoring for the approved capability matrix, including stages, human tasks, case variables, sentries, milestones, and timers where supported; verify representative CMMN documents round-trip through the editor and pass backend validation.
- [x] 7.4 Implement draft save, validation display, immutable version creation, and publish controls; verify the UI prevents publication when backend validation fails and shows publication correlation/status details.
- [ ] 7.5 Clarify the IDE interaction model for unsaved changes, concurrent editing, conflict resolution, keyboard shortcuts, and model recovery; verify the chosen behavior is captured in frontend acceptance tests.

## 8. Work frontend and generic form renderer

- [x] 8.1 Create the work frontend shell with process/case catalog, task inbox, task detail, instance detail, and status navigation; verify the shell loads through the work Spring Boot application and respects client scope.
- [x] 8.2 Implement schema-driven generic form rendering for the approved field types, labels, required/type constraints, initial values, and variable mappings; verify forms render without process-specific frontend code.
- [ ] 8.3 Implement start-process/start-case, task submission, validation errors, task completion, and next-state refresh flows; verify browser tests cover both valid and invalid submissions.
- [ ] 8.4 Implement basic process and case monitoring views with active state, task state, version, and timeline data; verify the UI handles empty, failed, completed, and unauthorized states without exposing protected data.
- [ ] 8.5 Clarify accessibility, localization, responsive behavior, and browser support requirements for both frontends; verify the agreed baseline with automated accessibility and browser smoke checks.

## 9. Publication integration and end-to-end vertical slice

- [ ] 9.1 Connect modeler publication to work-app publication intake using the shared contract and authenticated client-runtime routing; verify a modeler publish creates an active definition in the intended client runtime without manual configuration.
- [ ] 9.2 Implement publication retry/status polling and failure presentation in the modeler; verify transient duplicate requests are idempotent and failed publication never replaces the last active version.
- [ ] 9.3 Execute the full BPMN vertical slice from model creation through task completion and audit lookup; verify it passes with two clients and includes negative cross-client assertions.
- [ ] 9.4 Execute the full CMMN vertical slice from case creation through supported case execution and case status inspection; verify all elements in the first-release capability matrix behave as declared.
- [ ] 9.5 Clarify deployment topology, local startup commands, service URLs, secrets handling, and client-runtime provisioning for developer environments; verify a new developer can start both apps and execute the vertical slice from documented instructions.

## 10. Hardening, observability, and release readiness

- [ ] 10.1 Add database migrations, production profiles, secret injection, connection-pool settings, and per-client runtime provisioning checks; verify clean installation and upgrade migrations on a production-like relational database.
- [ ] 10.2 Add structured logs, metrics, traces or correlation propagation, dependency health, and publication/runtime operational diagnostics; verify an operator can trace one publication from modeler request through Flowable deployment.
- [ ] 10.3 Add API contract tests, backend integration tests, frontend browser tests, cross-client authorization tests, and representative BPMN/CMMN round-trip tests to CI; verify CI fails on contract drift or unsupported runtime behavior.
- [ ] 10.4 Document Flowable OSS reuse boundaries, supported capability matrix, versioning policy, identity model, client-runtime architecture, rollback process, and known limitations; verify the documentation matches the implemented contracts and deployment artifacts.
- [ ] 10.5 Perform a human-supervised release review against every requirement in the four capability specs; verify all acceptance evidence is linked to a test, observable behavior, or approved limitation before the first production deployment.

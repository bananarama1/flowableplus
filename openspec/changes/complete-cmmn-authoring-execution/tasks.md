# Tasks

## 1. Constrained CMMN editor

- [ ] 1.1 Define the supported CMMN element operations and editor state for stages, human tasks, sentries, milestones, timers, case variables, and assignments, and verify each operation maps to the capability matrix.
- [ ] 1.2 Replace source-string element insertion with parsed moddle model mutations and serialization, and verify added elements receive stable identifiers and valid CMMN namespaces.
- [ ] 1.3 Add representative CMMN fixtures containing supported elements plus unknown Flowable and custom extensions, and verify import/edit/export preserves unknown extension data.
- [ ] 1.4 Bind the constrained editor to the selected workspace draft and read-only published-version behavior, and verify CMMN source is loaded and saved through the same version lifecycle as BPMN.

## 2. CMMN validation and publication

- [ ] 2.1 Extend modeler validation tests for missing case identifiers, unsupported event listeners/discretionary items, invalid variables, assignments, timers, and form metadata, and verify errors identify the rejected rule.
- [ ] 2.2 Extend the shared publication contract and modeler publication mapping for CMMN identity, source content, metadata, actor, correlation, and idempotency, and verify complete and incomplete envelopes behave as specified.
- [ ] 2.3 Enforce work-app CMMN compatibility validation and client authorization before case deployment, and verify unsupported or cross-client publications do not replace the active case version.
- [ ] 2.4 Add idempotent CMMN publication persistence and activation, and verify duplicate requests return one result and create no duplicate active case deployment.

## 3. CMMN runtime and work experience

- [ ] 3.1 Implement or complete the Flowable CMMN adapter for deployment, case start, variables, human tasks, and history, and verify it uses real CMMN services in integration tests.
- [ ] 3.2 Add active CMMN case definitions to the client-scoped catalog with version, type, display name, startability, and start metadata, and verify foreign and superseded cases are hidden from normal starts.
- [ ] 3.3 Validate CMMN start variables and start the representative supported case, and verify valid input creates a case while invalid input creates none.
- [ ] 3.4 Expose case instance detail/history and any supported human-task form state, and verify authorized users can inspect the selected case version without crossing client boundaries.

## 4. Round-trip and end-to-end evidence

- [ ] 4.1 Add frontend round-trip tests for every declared supported element and unknown-extension preservation, and verify serialization remains valid after a known-element edit.
- [ ] 4.2 Add publication and runtime integration tests for a representative case through publication, start, and history inspection, and verify unsupported constructs fail before activation.
- [ ] 4.3 Add browser coverage for selecting CMMN, authoring, saving, validating, and reporting publication/runtime errors, and verify the work UI handles empty, failed, and unauthorized case states.
- [ ] 4.4 Run Maven, frontend build, contract, and focused CMMN integration suites, and verify the final capability matrix matches executable test evidence with deferred features still rejected or unavailable.
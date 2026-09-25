# Tasks

## 1. Authenticated modeler publication flow

- [ ] 1.1 Connect the selected workspace version from `complete-modeler-workspace` to BPMN validation and publication controls, and verify the UI never validates or publishes a local sample in place of the selected persisted version.
- [ ] 1.2 Propagate the authenticated bearer token, actor identity, client scope, and correlation identifier from the modeler request into the work-app publication request, and verify an authorized publication is accepted while an unauthorized one is rejected.
- [ ] 1.3 Render active, failed, validation, and transport publication outcomes, and verify a failed request leaves the local version unpublished and reports its correlation context.

## 2. Publication contract and runtime activation

- [ ] 2.1 Verify the BPMN publication envelope maps identity, immutable version, XML content, form schema, actor, correlation, and idempotency fields, and add contract tests for complete and incomplete envelopes.
- [ ] 2.2 Enforce publication authorization and client-runtime resolution before deployment, and verify cross-client requests create no deployment or active publication record.
- [ ] 2.3 Make BPMN validation, Flowable deployment, publication persistence, and active-version selection transactional, and verify activation failure preserves the previous active version.
- [ ] 2.4 Add duplicate-publication handling keyed by client/model/version/idempotency data, and verify repeated requests return one logical result and do not create duplicate Flowable deployments.

## 3. BPMN work execution path

- [ ] 3.1 Expose the active client-scoped BPMN catalog with version, type, display name, startability, and form metadata, and verify superseded or foreign-client definitions are not normal start options.
- [ ] 3.2 Validate start variables and start the representative BPMN process through the real Flowable adapter, and verify valid input creates an instance while invalid input creates none.
- [ ] 3.3 Load the assigned task and generic form schema in the work UI, and verify fields, labels, required rules, and current values render without process-specific frontend code.
- [ ] 3.4 Validate and complete one invalid and one valid task submission, and verify invalid input leaves the task active while valid input persists variables and advances the process.
- [ ] 3.5 Expose process instance detail/history and audit evidence, and verify the selected client, model version, task state, and completion outcome are observable.

## 4. Cross-application verification

- [ ] 4.1 Add service-level integration tests using the local modeler and work profiles with real persistence and Flowable services, and verify the complete BPMN flow from draft through task completion.
- [ ] 4.2 Add browser coverage for authenticated modeler publication and work execution plus unauthenticated and cross-client failures, and verify the responsive shell remains free of horizontal overflow.
- [ ] 4.3 Run the shared-contract, modeler, work-app, frontend, and focused integration suites, and verify publication failures never deactivate the last active runtime version.
# Tasks

## 1. Documentation inventory and ownership map

- [ ] 1.1 Inventory the implemented ownership boundaries, API contracts, configuration keys, database migrations, deployment artifacts, and representative tests across `modeler-app`, `work-app`, `platform-contracts`, and `platform-flowable`; record each source alongside the documentation topic it supports.
- [ ] 1.2 Add or update a concise `docs/` documentation index and cross-links so architecture, capability, publication, runtime, identity, client-runtime, frontend, and developer-setup documents are discoverable; verify every listed document exists and links resolve.

## 2. Flowable compatibility and versioning documentation

- [ ] 2.1 Update the architecture and capability documentation to state the Flowable OSS reuse boundary, the platform-owned adapter and application behavior, and the exclusion of Flowable Enterprise UI dependencies; verify the statements match the module structure and runtime integration tests.
- [ ] 2.2 Reconcile the BPMN/CMMN and form capability matrix with the implemented validators and publication behavior; verify every first-release row has exactly one explicit supported, rejected, or deferred outcome and an actionable publish-time rule.
- [ ] 2.3 Document immutable model versions, one active default version, superseded-version access, failed-publication behavior, rollback to a previously valid version, and the rule that running instances retain their selected version; verify the wording matches publication and runtime contract tests.

## 3. Identity, client runtime, and operational limitations

- [ ] 3.1 Reconcile identity and authorization documentation with the application-managed user, membership, role, token, provisioning, and recovery behavior; verify local-only seed credentials, production identity-provider boundaries, and secret-handling rules are explicit.
- [ ] 3.2 Reconcile client-runtime and deployment documentation with registry resolution, one runtime/database target per client, migration settings, unknown-client fail-closed behavior, and server-side credentials; verify configuration names match application properties and deployment artifacts.
- [ ] 3.3 Add or update a known-limitations section covering deferred BPMN/CMMN/form features, unsupported model-supplied code, archived editor dependencies, deployment assumptions, and any documented operational gaps; verify limitations do not claim unsupported behavior is available.

## 4. Documentation consistency verification

- [ ] 4.1 Add the smallest maintainable documentation consistency check or review script for required documents, capability outcome labels, architecture terms, configuration references, and referenced evidence files; verify it fails on a deliberately missing or stale required reference and passes for the repository state.
- [ ] 4.2 Run the documentation check with the relevant Maven, frontend, and focused integration checks; verify the final documentation links to executable evidence or clearly labels a limitation and does not present this change as human-supervised production release approval.
- [ ] 4.3 Review the completed documentation change against the `platform-documentation` scenarios and record any remaining known limitations or follow-up links; verify no runtime source, API, database, identity, or deployment behavior changed as part of this documentation-only change.

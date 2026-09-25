# Design

## Context

The platform implementation is distributed across two Spring Boot applications, shared Java modules, frontend assets, database migrations, and integration tests. The repository already has focused documents for architecture decisions, BPMN/CMMN capability support, runtime conventions, identity provisioning, client-runtime provisioning, publication behavior, and developer setup. The remaining work is to make those documents form a coherent operational contract and to keep them aligned with the implemented system.

This change is documentation-only. It does not change runtime APIs, Flowable behavior, identity behavior, deployment topology, or production release approval.

## Goals / Non-Goals

**Goals:**

- Establish one maintained documentation map for Flowable OSS reuse boundaries and platform-owned behavior.
- Make every first-release capability have an explicit supported, rejected, or deferred publication outcome.
- Make model versioning, active-version selection, rollback, and running-instance behavior unambiguous.
- Document application-managed identity, client isolation, per-client runtime provisioning, secret handling, and operational assumptions.
- Add lightweight consistency checks or documented review checks tied to contracts, configuration, deployment artifacts, and tests.

**Non-Goals:**

- Changing Java, frontend, database, Flowable, authentication, or deployment implementation.
- Expanding the first-release BPMN/CMMN capability matrix.
- Performing the descoped human-supervised release review from the original architecture change.
- Introducing a documentation platform, generated portal, or external knowledge base.

## Decisions

### 1. Use the existing documentation surfaces as the source of truth

Maintain the existing focused documents rather than creating one oversized architecture document. Update cross-links and add a short documentation index or ownership map where necessary. The architecture decision record remains authoritative for boundaries; the capability matrix remains authoritative for publish-time support outcomes; runtime, identity, provisioning, publication, and setup documents remain authoritative for their respective operational details.

Alternative considered: duplicate all rules in a new document. Rejected because duplicated policy would drift quickly and make conflicting statements harder to detect.

### 2. Document observable outcomes, not implementation aspirations

Each documented rule must be grounded in an existing contract, configuration key, migration artifact, test, endpoint, or explicitly marked known limitation. Proposed future work must be labeled as deferred or limited rather than described as available behavior.

The capability matrix continues to use three outcomes: supported, rejected, and deferred. Deferred entries remain unavailable for publication until their runtime and editor behavior is specified and tested.

### 3. Define versioning and rollback explicitly

Document immutable published model versions, the one active default version offered for normal starts, explicit handling of superseded versions, and the fact that failed publication leaves the previous active version unchanged. Running instances retain their selected definition/version and are not silently redirected by a later publication. Rollback means selecting or reactivating a previously valid version according to the implemented publication policy; it does not mutate an immutable version or rewrite running instances.

### 4. Tie identity and runtime documentation to deployment boundaries

Document application-managed users, client memberships, roles, bearer-token behavior in local development, the production identity-provider boundary, and server-side runtime credentials. Document that each client resolves to one Flowable runtime/database target and that unknown clients fail closed. Keep secrets out of public API examples and frontend configuration.

### 5. Validate documentation through traceable checks

Use a small, maintainable validation approach consistent with the repository toolchain. At minimum, checks should verify that required documentation files exist, required capability outcome labels and architecture terms are present, documented configuration names match application configuration, and referenced tests or deployment artifacts exist. Where automation would be brittle, use a review checklist with direct file and test references rather than pretending to provide exhaustive semantic validation.

## Risks / Trade-offs

- **Documentation drift:** Link each rule to a contract, configuration, test, or artifact and run focused checks in CI or the documented verification workflow.
- **Conflicting documents:** Keep ownership clear by topic and add cross-links; resolve conflicts in favor of executable contracts and current implementation evidence.
- **False release confidence:** State known limitations and explicitly exclude production sign-off from this change.
- **Over-documenting unstable details:** Record stable boundaries and observable behavior; avoid copying internal implementation details that are not part of an operator or developer contract.
- **Manual checks being skipped:** Keep the checklist short, name the exact evidence required, and include the check in the project’s normal validation path where practical.

## Migration Plan

1. Inventory the existing architecture, capability, runtime, identity, provisioning, publication, and setup documents against the implemented modules, configuration, migrations, and tests.
2. Update the focused documents and add the smallest useful cross-document index or traceability section.
3. Document version activation and rollback behavior, including the treatment of running instances and failed publications.
4. Add or update documentation consistency checks and execute them alongside the relevant Maven and frontend checks.
5. Review links, capability outcomes, configuration names, deployment instructions, and known limitations before marking this documentation change complete.

Rollback is limited to reverting documentation and documentation-check changes. No runtime data or deployment state is modified by this change.

## Open Questions

- The exact CI job that owns documentation consistency checks can remain a repository-maintainer choice, provided the checks are executable or the required review evidence is explicit.
- The final documentation index location can remain under `docs/` as long as the existing focused documents remain discoverable and cross-linked.

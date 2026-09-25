# Proposal

## Why

The platform architecture has been implemented across the modeler, work application, shared contracts, Flowable adapter, frontends, and integration tests, but the architectural operating rules are spread across several documents. The repository needs one focused documentation change that makes the implemented boundaries reviewable and keeps future changes aligned with the supported runtime behavior.

The remaining release-readiness documentation work is intentionally separate from the completed platform implementation. A human-supervised, all-requirements release review is descoped from the original architecture change and is not part of this proposal.

## What Changes

- Document the boundary between Flowable OSS reuse and platform-owned behavior, including the supported BPMN/CMMN capability matrix and publish-time outcomes.
- Document model and runtime versioning, active-version selection, rollback behavior, and the treatment of running instances.
- Document the application-managed identity model, client isolation rules, per-client Flowable runtime architecture, and provisioning boundary.
- Document known limitations and the relationship between the architecture decisions, API contracts, deployment artifacts, and operational setup.
- Add documentation consistency checks against the implemented contracts and deployment configuration.

## Capabilities

### New Capabilities

- `platform-documentation`: Maintained architecture, compatibility, versioning, identity, client-runtime, rollback, and limitation documentation for the implemented platform.

### Modified Capabilities

None. The existing platform capabilities are documented as implemented behavior; this change does not alter their runtime contracts.

## Impact

- Adds a focused OpenSpec change and a maintained documentation capability specification.
- Updates or consolidates documentation under `docs/`, including architecture decisions, capability support, runtime conventions, identity provisioning, client-runtime provisioning, publication behavior, and developer setup where needed.
- Adds documentation validation or review checks that detect drift from shared contracts, application configuration, deployment artifacts, and tests.
- Removes the original architecture change's human-supervised release-review task from scope as descoped; this change does not certify production readiness or replace human approval.

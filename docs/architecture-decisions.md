# FlowablePlus Architecture Baseline

This record captures the approved first-release architecture for the FlowablePlus platform.

## Application boundaries

- `modeler-app` is an independently deployable Spring Boot application that owns design-time projects, drafts, validation, immutable versions, and publication intent.
- `work-app` is an independently deployable Spring Boot application that owns the executable Flowable runtime, publication intake, process and case execution, tasks, and runtime history.
- `platform-contracts` contains versioned DTOs and API compatibility types shared across the application boundary.
- `platform-flowable` contains the narrow Flowable OSS adapter boundary and does not contain UI concerns.
- Each application serves its own frontend assets from its owning Spring Boot artifact.

## Runtime and publication

- The work application owns one Flowable runtime and database boundary per client.
- The modeler owns source XML, metadata, drafts, published versions, and publication records in its own persistence boundary.
- Modeler-to-work publication uses an authenticated, versioned HTTP contract with a complete immutable envelope and correlation identifier.
- Publication is idempotent for a client, model key, immutable version, and idempotency key. A failed publication never replaces the previous active version.
- Exactly one configured active default version is offered for normal starts; older versions remain available only through explicit version policy.

## Model scope

- BPMN and CMMN are first-release model types.
- Full CMMN authoring and execution is in scope for the supported capability matrix; unsupported engine or editor features must be rejected or explicitly deferred at publish time.
- Published versions are immutable. Editing a published version requires creating a new draft.
- Generic work forms are driven by versioned published metadata rather than process-specific frontend code.

## Identity and client isolation

- Identity is application-managed for the first release, with user identity, client membership, and application roles kept separate from the authentication implementation.
- Protected model, publication, runtime, task, and administration operations require authentication, authorization, and explicit client scope checks.
- Database credentials are server-side registry configuration and are never exposed to frontend callers or publication clients.

## Compatibility and operations

- Flowable OSS is the execution foundation; Flowable Enterprise UI modules are not required.
- Each application exposes an independent health response for its dependencies.
- Correlation identifiers propagate through API responses, structured logs, and publication processing.
- Java 17, Spring Boot 4.0.2, Flowable 8.0.0, Maven, and the frontend toolchain require an explicit boot and BPMN/CMMN deployment compatibility spike before module implementation begins.

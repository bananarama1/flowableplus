# Design

## Context

See `proposal.md` for the motivation and capability boundaries. The current repository is a single Spring Boot application using Java 17, Spring Boot 4.0.2, Flowable 8.0.0, an H2 in-memory database, and one `/flowable/status` endpoint. There are no existing OpenSpec capability specifications, frontend applications, persistent model store, authentication boundary, or publication protocol.

The requested product is a reusable modeler for multiple clients. The modeler should feel like an IDE for Flowable models, while the work application should remain generic and render forms without process-specific frontend code. CMMN is required in addition to BPMN, and the two applications must live in one repository but remain independently deployable.

## Goals / Non-Goals

**Goals:**

- Define two independently deployable Spring Boot applications in one repository.
- Make the modeler the owner of design-time documents, drafts, versions, validation, and publication intent.
- Make the work application the owner of executable Flowable runtime state, tasks, cases, process instances, and runtime history.
- Use a versioned shared contract module instead of sharing database tables or internal application classes.
- Support client-scoped models and runtime operations with explicit authorization checks.
- Support generic task forms through published metadata and a stable schema.
- Keep Flowable OSS as the runtime foundation without depending on Enterprise UI modules.
- Make publication idempotent, observable, and safe to retry.

**Non-Goals:**

- Reimplementing the Flowable process or case engine.
- Building a general-purpose low-code form builder in the first milestone.
- Providing advanced analytics, SLA dashboards, or enterprise administration beyond the specified task and instance views.
- Supporting arbitrary custom Java code execution supplied by modelers.
- Sharing the modeler and work application database as an implicit integration mechanism.
- Defining every BPMN or CMMN palette element before the first vertical slice is proven.

## Decisions

### 1. Repository and application boundaries

Use a Maven multi-module repository with these logical modules:

- `platform-contracts`: versioned DTOs, publication envelope, error model, model metadata schema, and API compatibility types.
- `platform-flowable`: narrowly scoped adapters around Flowable repository, runtime, task, history, and CMMN services. It must not contain UI concerns.
- `modeler-app`: Spring Boot backend and modeler frontend assets/build integration. Owns model projects, drafts, versions, validation, and publication requests.
- `work-app`: Spring Boot backend and work frontend assets/build integration. Owns the executable Flowable runtime, publication intake, task APIs, form metadata, and instance views.

The two applications SHALL be separate executable artifacts and SHALL have separate configuration, health checks, and deployable runtime dependencies. The shared modules contain stable contracts and technical helpers only; they do not make either application dependent on the other's internal package structure.

Alternative considered: retain one Spring Boot application with two route groups. Rejected because the target is a reusable multi-client product and the modeler and work app have different ownership, security, and release concerns.

### 2. Runtime ownership and publication transport

The work application owns the executable Flowable engine and its runtime database. The modeler stores source model documents and version history in its own persistence boundary. The modeler publishes validated immutable versions to a work-app publication endpoint over authenticated HTTP using the shared publication envelope.

The work app performs its own compatibility validation before activation. It creates the Flowable deployment or case deployment, records the resulting runtime reference, and returns a publication status. The modeler retains the publication record and correlation identifier.

Publication is synchronous for the first vertical slice, with a durable publication state and idempotency key so a later implementation can add asynchronous retry processing without changing the external model identity. The work app must never activate a second deployment for the same client, model key, version, and idempotency key.

Alternative considered: share one Flowable database between both applications. Rejected because it couples deployments to Flowable schema ownership, makes independent operation misleading, and allows one app to bypass the publication contract. Alternative considered: introduce a message broker immediately. Deferred because it adds operational complexity before the synchronous contract and retry semantics are proven.

### 3. Model storage and lifecycle

The modeler persistence model should separate:

- client/tenant scope
- model project identity and stable key
- model type (`BPMN` or `CMMN`)
- immutable version records
- draft content and metadata
- validation results
- publication attempts and runtime references
- audit events

Published versions are immutable. A new edit creates or updates a draft and publication creates a new immutable version. A model key is stable across versions so runtime consumers can identify a process or case family while selecting a concrete version according to the publication policy.

Use a relational database and explicit migration scripts. H2 remains useful for a local lightweight profile, but production compatibility must be verified against PostgreSQL before implementation is considered complete.

### 4. Model document and metadata strategy

Persist the original BPMN/CMMN XML as the source of truth. Store normalized searchable metadata separately rather than attempting to reconstruct all editor state from rendered diagrams. Metadata includes model display information, startability, task form references, variable schemas, assignments, and client scope.

Use a namespaced extension metadata model for application-specific information. Flowable-specific XML remains valid Flowable XML; application metadata must be distinguishable from engine semantics and must be validated before publication.

The generic form schema is a deliberately constrained contract in the first milestone: supported field types, labels, required/type constraints, initial values, and submission mapping. Unsupported controls or arbitrary executable expressions cause validation failure or an explicit unsupported state; they do not silently degrade.

Alternative considered: infer all forms from BPMN XML. Rejected because BPMN task elements do not provide a complete, stable user-form contract. Alternative considered: embed process-specific frontend components. Rejected because it defeats the generic work UI requirement.

### 5. Flowable integration

The platform-flowable module exposes application-level operations rather than leaking Flowable services across controllers. The work app uses Flowable RepositoryService and CMMN repository APIs for deployment, RuntimeService and CmmnRuntimeService for execution, TaskService for user tasks, and history/query APIs for instance views.

The integration must include a capability matrix for BPMN and CMMN elements supported by the configured Flowable OSS version. Publication validates against that matrix before activation. The existing status endpoint is retained or replaced by an equivalent application health endpoint during migration so runtime availability remains observable.

The current combination of Spring Boot 4.0.2 and Flowable 8.0.0 requires a compatibility verification spike before broad implementation. If the tested combination is not supported, the project must choose a supported Spring Boot baseline rather than masking dependency failures with custom patches.

### 6. Frontend architecture

The modeler frontend uses an IDE-like shell with project navigation, model tabs, central canvas, properties/metadata panel, validation output, version history, and publish status. BPMN editing should use a proven BPMN modeler library such as `bpmn-js`. CMMN authoring and round-trip support are first-release requirements and must be implemented using a validated CMMN editor/parser approach compatible with the configured Flowable runtime.

The work frontend provides process and case catalogs, task inbox, task detail, generic form renderer, process/case instance detail, and basic status views. It consumes only work-app APIs and published metadata; it does not parse or execute Flowable XML in the browser.

Each Spring Boot app serves its own frontend assets so the initial deployment has one independently deployable artifact per application. A shared TypeScript contract package may be generated from the backend API schema, but generated client code must remain a versioned integration artifact rather than importing Java implementation classes into frontend builds.

### 7. Security and client isolation

Use application-managed identity for the first release. Every protected request carries an authenticated principal and is authorized against client scope and operation permission. Modeler permissions and work permissions are distinct even if a user can hold both. The identity model should preserve a later migration path to OIDC/OAuth2 by separating user identity, client membership, and application roles from authentication implementation details.

Client scope must exist in model, publication, runtime catalog, task, and audit records. The first production architecture uses a separate Flowable runtime and database boundary per client. Repository methods and API tests must still enforce client scope because the modeler control plane and publication service remain multi-client. A deployment registry maps each client to its runtime connection and publication target without exposing database credentials to the frontend.

### 8. Testing and delivery strategy

Build a vertical slice before implementing every editor feature:

1. create a BPMN draft
2. validate and publish it
3. activate it in the work app
4. start a process instance
5. retrieve and render a user task form
6. complete the task
7. inspect publication and instance status

Use unit tests for validation and mapping, integration tests with a real relational database and Flowable engine, contract tests across the publication boundary, and browser tests for the critical modeler-to-work flow. Do not use mocks as the only evidence for deployment or task behavior.

## Risks / Trade-offs

- [Flowable/Spring compatibility] → Verify the current dependency combination in an isolated boot and deployment spike before creating the multi-module baseline; pin a supported version pair.
- [CMMN editor availability] → Prove full CMMN authoring, round-trip XML support, and runtime case execution early. Do not call the first release complete until representative CMMN cases execute through the assigned client runtime.
- [Publication outage] → Persist publication attempts and idempotency keys, return queryable status, and keep the last active runtime version unchanged on failure.
- [Per-client runtime provisioning] → Define a secure client-runtime registry, provision and migrate each Flowable database consistently, and add cross-client negative integration tests at both control-plane and runtime boundaries.
- [Generic form schema too limited] → Version the form schema and make unsupported field types explicit so capabilities can grow without breaking existing published models.
- [Editor XML drift] → Store original XML, run round-trip tests for representative BPMN/CMMN models, and validate generated documents before publication.
- [Independent app deployment complexity] → Provide local profiles and containerized integration environments that start both apps with explicit dependency configuration.
- [Runtime versioning ambiguity] → Define a default-start policy and preserve explicit version references in publication and process-instance records; do not silently redirect running instances.

## Migration Plan

1. Freeze the existing status endpoint behavior as a regression test.
2. Create the multi-module build and move current Flowable configuration into the shared/runtime ownership model without changing the observable health check.
3. Add the work app as the first executable runtime owner and verify BPMN deployment, process start, task completion, and status queries.
4. Add the modeler persistence boundary, application-managed identity, client-runtime registry, and publication endpoint integration.
5. Add the modeler and work frontends around the vertical slice.
6. Add CMMN storage, validation, publication, and execution incrementally after the BPMN slice is proven.
7. Introduce production database configuration and migrations, retaining H2 only for local development/tests where appropriate.
8. Roll back by disabling the new applications and retaining the existing single-app artifact until the runtime and publication integration tests pass. Published Flowable deployments remain versioned; failed new publications must not deactivate the last active version. New process starts select the one active default version; older versions remain available only according to the explicit version policy.

## Open Questions

None for the architecture baseline. The first implementation targets app-managed identity, a separate Flowable runtime/database per client, full CMMN authoring and execution for the supported capability matrix, one active default version per model key, and frontend assets served by their owning Spring Boot application.

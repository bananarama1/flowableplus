# Design

## Context

The modeler already has version validation and a `ModelerPublicationClient`; the work app already exposes runtime execution endpoints and local bearer-token authentication. The remaining risk is contract wiring: the browser must select a real persisted version, the modeler must forward authorization to the publication client, and the work app must activate the same client-scoped BPMN definition that the catalog and task APIs consume.

## Goals / Non-Goals

**Goals:**

- Prove one authenticated BPMN path from modeler draft to completed work task.
- Make publication failure atomic from the user's perspective and preserve the previous active version.
- Exercise real Flowable repository, runtime, task, and history behavior with client isolation.
- Provide browser evidence for modeler publication and work execution, including invalid input.

**Non-Goals:**

- Implementing CMMN runtime behavior; that is the next change.
- Adding a general workflow designer or every BPMN element in the capability matrix.
- Introducing asynchronous publication, retries, polling, or a message broker.

## Decisions

### 1. Keep publication synchronous and request-scoped

The modeler sends one authenticated publication request with a correlation and idempotency key. The work app validates, deploys, records the result, and activates the definition in one transaction boundary. Transport failure is shown as failure and does not trigger browser retries.

Alternative considered: queue publication and poll status. Rejected because it would make the first vertical slice harder to diagnose and is outside the existing contract.

### 2. Forward the caller's bearer token at the application boundary

The modeler controller accepts the authenticated request token and the publication client forwards it to the work-app publication endpoint. The browser token is never copied into a query parameter or persisted in a publication record; actor and correlation identifiers remain explicit metadata.

Alternative considered: a shared service credential only. Rejected because it loses caller authorization and cannot enforce the target client's user permission.

### 3. Use one representative BPMN process and one generic form

The acceptance path uses a start event, a user task with a versioned form schema, and an end event. It starts the process, loads the task form, rejects one invalid submission, accepts one valid submission, and verifies history. This keeps the slice narrow while exercising the full contract.

### 4. Verify isolation at both boundaries

Tests publish or query the same logical model key under two clients and assert that catalog, start, task, and publication operations cannot cross client scope. Runtime assertions use the real client runtime resolution and Flowable services.

## Risks / Trade-offs

- **Local modeler and work apps use different ports or credentials:** provide a documented local profile and test fixture that starts both services with explicit publication URL and seed user data.
- **Publication response and local version state diverge:** update local state only after an active response and retain failure details otherwise.
- **Flowable deployment succeeds but activation persistence fails:** keep deployment and activation in the work-app transaction boundary and test rollback/failure behavior.
- **Browser tests become environment-sensitive:** keep contract/unit checks close to each module and use a deterministic integration profile for the cross-app browser test.
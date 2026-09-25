---
name: work-vertical-slice
description: Use when validating the published BPMN path from modeler publication through process start, task inbox, task completion, and audit history. Do not use for isolated frontend unit tests, contract-only DTO edits, or CMMN-only workflows.
license: MIT
compatibility: Requires Java 17, Docker Compose PostgreSQL, both Spring Boot applications, and Playwright dependencies for browser checks.
metadata:
  author: FlowablePlus
---

# Published BPMN vertical slice

Use the documented local topology: modeler-app on `http://localhost:8080`, work-app on `http://localhost:8081`, and PostgreSQL supplied by Docker Compose. Follow the complete request sequence in [developer setup](../../../docs/developer-setup.md) rather than inventing alternate endpoints.

1. Confirm Java 17, Docker Desktop with Compose, Node.js/npm, and the required Playwright browser are available. Start PostgreSQL with `docker compose up -d postgres`, then start modeler-app with `./mvnw -B -ntp -pl modeler-app spring-boot:run` and work-app with `./mvnw -B -ntp -pl work-app spring-boot:run`, using the local profile when required by the setup guide.
2. Check `GET /health` on both applications and `GET /flowable/status` on work-app. Stop and report the unavailable prerequisite or unhealthy service; do not claim a vertical-slice result from unit tests alone.
3. Use the local `modeler` identity in client scope `client-local` to create a BPMN project, save a draft, validate it, and publish an immutable version through modeler-app. Keep bearer tokens in the current shell only.
4. Use the local `alice` identity to start the active process in work-app, read the client-scoped task inbox, complete the assigned user task, and query process history and the audit endpoint.
5. Verify the expected outcomes: an `ACTIVE` publication, one process instance, one `alice` task, successful completion, and audit records for publication, process start, and task completion.
6. For browser-facing changes, install the CI browser dependency with `npx playwright install --with-deps chromium` and run `npm --prefix work-app/frontend run test:browser` while work-app is running. The browser suite must cover the authenticated shell and unauthenticated rejection without horizontal overflow.

## Validation outcome

The vertical slice passes only when the publication is active, the same client-scoped definition starts, the expected task can be completed, audit history records all three lifecycle events, and any applicable browser smoke tests pass.
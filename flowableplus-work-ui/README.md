# Flowable Plus Work UI

React and Vite frontend for the first Flowable Plus application slice.

## First workflow

The UI supports the target workflow of logging in, selecting a pre-deployed approval process, starting it, viewing the resulting task, claiming it, completing it, and verifying the resulting state.

The UI uses the native Flowable REST API under `/flowableplus-api`. Vite proxies local API requests to the Spring Boot application during development.

## End-to-end tests

Browser tests belong in a Playwright suite and should run against the complete Docker Compose stack. The primary scenario is:

```text
login -> process definitions -> start approval -> task -> claim -> complete -> verify
```

Authentication failures, authorization failures, expired sessions, validation errors, and task conflicts are displayed in a top-level text banner.

Every requirement in `docs/specs` has a corresponding Playwright test named with its `REQ-*` identifier. Tests for deferred UI behavior stay active and fail explicitly with `REQ-* not implemented` until the UI is available.

## Local development

From the repository root:

```text
docker compose up --build --watch
```

The UI is available at `http://localhost:3000`.

## Test isolation

Playwright tests import `test` from `tests/fixtures.ts`, whose automatic fixture deletes all runtime process instances after each test, mirroring the cleanup done by `@DeployFlowableApp` in backend tests. Tests must not depend on state left by other tests.

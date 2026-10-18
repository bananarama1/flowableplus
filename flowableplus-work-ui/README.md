# Flowable Plus Work UI

React and Vite frontend for the first Flowable Plus application slice.

## First workflow

The UI supports the target workflow of logging in, selecting a pre-deployed approval process, starting it, viewing the resulting task, claiming it, completing it, and verifying the resulting state.

The UI uses the native Flowable REST API under `/flowableplus-api`. Vite proxies local API requests to the Spring Boot application during development.

## End-to-end tests

Browser tests run against a dedicated backend and PostgreSQL stack defined in `../compose.playwright.yaml`. Playwright starts that stack before the suite and tears it down, including its database volume, after the suite. The primary scenario is:

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

Playwright tests import `test` from `tests/fixtures.ts`. Its automatic `flowableApp` fixture deploys the `processes` sample model app before each test through the test deployment API and deletes that deployment afterward. The dedicated database is removed with the backend stack after the suite, so local Compose data is not affected.

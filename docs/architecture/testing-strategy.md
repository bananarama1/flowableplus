# Testing Strategy

Flowable Plus uses three complementary test layers.

## Unit and slice tests

Use Maven Surefire for fast tests of focused Java behavior. These tests should not require Docker.

## Java integration tests

`flowableplus-work-integration-tests` is the black-box acceptance suite for the reusable starter. It consumes `flowableplus-work-starter` as an application would and runs against PostgreSQL and Mailpit Testcontainers.

The suite verifies:

- Spring Boot and Flowable engine startup;
- BPMN, CMMN, and application deployments;
- PostgreSQL persistence;
- native REST endpoints used by the UI;
- login and authorization behavior;
- task claiming and completion;
- Flowable request and response compatibility.

`flowableplus-work-test-models` contains stable minimal fixtures. `flowableplus-example-models` contains realistic models for the example application; integration tests may use those models when validating example behavior.

## Playwright end-to-end tests

Playwright tests exercise the complete user journey against the running Compose stack:

```text
login
  -> view process definitions
  -> start an approval process
  -> view the assigned task
  -> claim the task
  -> complete the task
  -> verify the resulting state
```

Playwright validates the browser, React UI, session authentication, REST API, backend, database, and deployed process together. It complements rather than replaces Java integration tests.

## Upgrade rule

When upgrading Flowable, run the Java REST integration tests and Playwright suite. Update the contracts only when the change is intentional and documented in an ADR or compatibility note.

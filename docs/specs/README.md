# Feature Specifications

Feature specifications define observable application behavior. They complement the architecture decision records in `docs/architecture/`:

- ADRs define architectural constraints and the reasons for them.
- Feature specifications define what the application must do.
- Automated tests provide executable evidence that the behavior works.

## Development loop

For each feature increment:

1. Add or refine requirements and scenarios in the relevant feature specification.
2. Give each requirement a stable identifier such as `REQ-APP-001`.
3. Add one focused backend integration test and one Playwright UI test for the requirement before implementing the behavior. Both tests must include the requirement ID.
4. Implement the smallest vertical slice that makes the test pass.
5. Refactor without changing the specified behavior.
6. Run the narrow test first, then the applicable Maven, UI, and Playwright checks.
7. Update the specification only when an intentional behavior change has been agreed and documented.

## Scenario format

Use Given/When/Then scenarios for user-visible behavior. Keep scenarios independent of implementation details unless they define a public REST contract.

```text
Scenario: The authenticated user can claim an available approval task

Given demo is authenticated
And an approval process has created a candidate task
When demo claims the task
Then the task is assigned to demo
And it is no longer available as an unclaimed candidate task
```

## Test ownership

- Java unit and slice tests live with the production module and run with Surefire.
- Black-box REST and persistence tests live in `flowableplus-work-integration-tests` and run with Failsafe against PostgreSQL Testcontainers.
- Browser acceptance tests live in `flowableplus-work-ui` and run with Playwright against the Compose stack.

Every requirement must have both a backend integration test and a Playwright UI test. Requirement IDs should appear in test names so coverage can be found without a separate traceability tool, for example `reqApp005DemoCanClaimCandidateTask` and `REQ-APP-005 demo can claim candidate task`.

Tests for behavior that is not implemented must remain active and fail explicitly with a message such as `REQ-APP-005 not implemented`. Do not use `@Disabled`, skipped tests, or missing test files to represent deferred implementation. A passing backend test and a passing Playwright test are separate evidence: both are required for a user-visible requirement to be complete.

## API rule

Use native Flowable REST representations for native engine behavior. Add a Plus-specific REST contract only when the behavior does not exist in Flowable OSS. REST contract tests must cover every native endpoint used by the UI.

## Definition of done

A requirement is complete when:

- its behavior and failure cases are specified;
- its implementation respects the accepted ADRs;
- a backend test covers the public behavior;
- a Playwright test covers the user-visible behavior;
- both tests pass, or any incomplete implementation is reported by an active explicit failure;
- the relevant test and build checks pass.

## Current specification

- [First approval workflow](approval-workflow.md)

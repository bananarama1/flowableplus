# First Approval Workflow

Status: Target for the first application version

This specification defines the first complete user journey from [ADR-002](../architecture/decisions/ADR-002-first-application-slice.md). It is intentionally narrow: one development user, one pre-deployed approval process, PostgreSQL persistence, native Flowable REST, and a browser session shared by the UI and API.

## Actors and fixtures

- User: `demo`, defined in Spring Security and mirrored in Flowable IdentityService.
- Process: `simpleApprovalProcess`.
- Database: PostgreSQL.
- Process deployment: classpath deployment during application startup.
- Native API base: `/flowableplus-api`.

## Scope

The first version supports:

- browser form login with a session cookie;
- listing available process definitions;
- clear top-level UI errors for authentication and session failures.

The first version does not include tenants, external identity providers, runtime model editing, model administration, or application-owned business tables.

## Requirements

### REQ-APP-001: Authenticate the user

The user can submit the development login form and receive an authenticated browser session. The same authenticated session is used for UI requests to the native Flowable REST API.

### REQ-APP-002: Reject unauthenticated API access

An unauthenticated request to a protected Flowable REST resource receives `401` or the configured login response. The UI presents a login or session-expired message rather than an empty success state.

### REQ-APP-003: List deployed process definitions

An authenticated user can view the pre-deployed `simpleApprovalProcess` definition. The UI uses the native Flowable process-definition response shape.

## Acceptance scenarios

### Scenario 1: Complete approval journey

```text
Given the Compose stack is running
And the demo user is not yet authenticated
When the user logs in
Then the process definitions view is displayed
```

Covers: `REQ-APP-001`, `REQ-APP-003`.

### Scenario 2: Unauthenticated access

```text
Given the user has no authenticated session
When the user requests a protected process or task resource
Then the request is rejected
And the UI shows a login or session-expired message
```

Covers: `REQ-APP-002`.

## Test mapping

| Requirement | Java integration test | Playwright test |
|---|---:|---:|
| REQ-APP-001 | Yes | Yes |
| REQ-APP-002 | Yes | Yes |
| REQ-APP-003 | Yes | Yes |

The Java integration suite is the first implementation gate. The Playwright suite becomes the release gate once the browser workflow is available.

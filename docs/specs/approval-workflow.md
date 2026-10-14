# First Approval Workflow

Status: Target for the first application version

This specification defines the first complete user journey from [ADR-002](../architecture/decisions/ADR-002-first-application-slice.md). It is intentionally narrow: one development user, one pre-deployed approval process, PostgreSQL persistence, native Flowable REST, and a browser session shared by the UI and API.

## Actors and fixtures

- User: `demo`, defined in Spring Security and mirrored in Flowable IdentityService.
- Process: `simpleApprovalProcess`.
- Database: PostgreSQL.
- Process deployment: classpath deployment during application startup.
- Native API base: `/flowableplus-api`.

The approval user task must be claimable by `demo`, either as a candidate user or through a candidate group with `demo` as a member.

## Scope

The first version supports:

- browser form login with a session cookie;
- listing available process definitions;
- starting the supported approval process;
- viewing the resulting candidate task;
- claiming the task;
- completing the task assigned to the authenticated user;
- viewing the resulting completed process state;
- clear top-level UI errors for authentication, authorization, validation, session, and task-conflict failures.

The first version does not include tenants, external identity providers, runtime model editing, model administration, or application-owned business tables.

## Requirements

### REQ-APP-001: Authenticate the user

The user can submit the development login form and receive an authenticated browser session. The same authenticated session is used for UI requests to the native Flowable REST API.

### REQ-APP-002: Reject unauthenticated API access

An unauthenticated request to a protected Flowable REST resource receives `401` or the configured login response. The UI presents a login or session-expired message rather than an empty success state.

### REQ-APP-003: List deployed process definitions

An authenticated user can view the pre-deployed `simpleApprovalProcess` definition. The UI uses the native Flowable process-definition response shape.

### REQ-APP-004: Start an approval process

An authenticated user can start `simpleApprovalProcess`. The process instance is persisted in PostgreSQL and creates the approval user task.

### REQ-APP-005: View the candidate task

The authenticated user can view the task created by the approval process when the user is an eligible candidate. The task has a stable identifier and is associated with the started process instance.

### REQ-APP-006: Claim the task

The authenticated user can claim the candidate task. After claiming, the task is assigned to `demo` and is no longer an unclaimed candidate task.

### REQ-APP-007: Complete the assigned task

The authenticated user can complete a task assigned to that user. The process reaches its completed state and no active approval task remains.

### REQ-APP-008: Reject unauthorized task completion

A user cannot complete a task assigned to another user. The API returns an authorization failure and the UI shows a top-level authorization message.

### REQ-APP-009: Report task conflicts

If a task is claimed or changed before the current operation completes, the API returns a conflict or equivalent Flowable error. The UI explains that the task changed and the user must refresh.

### REQ-APP-010: Report Flowable validation errors

For an invalid process or task request, the UI displays a safe server-provided validation message in the top-level error banner.

## Acceptance scenarios

### Scenario 1: Complete approval journey

```text
Given the Compose stack is running
And the demo user is not yet authenticated
When the user logs in
Then the process definitions view is displayed

When the user starts simpleApprovalProcess
Then a new approval process is created
And its candidate task is displayed

When the user claims the task
Then the task is assigned to demo

When the user completes the task
Then the process is shown as completed
And no active approval task remains
```

Covers: `REQ-APP-001`, `REQ-APP-003`, `REQ-APP-004`, `REQ-APP-005`, `REQ-APP-006`, `REQ-APP-007`.

### Scenario 2: Unauthenticated access

```text
Given the user has no authenticated session
When the user requests a protected process or task resource
Then the request is rejected
And the UI shows a login or session-expired message
```

Covers: `REQ-APP-002`.

### Scenario 3: Unauthorized completion

```text
Given a task is assigned to another user
When demo attempts to complete that task
Then the request is rejected
And the UI shows an authorization message
And the task remains incomplete
```

Covers: `REQ-APP-008`.

### Scenario 4: Task conflict

```text
Given demo is viewing an available task
And another operation claims or completes that task
When demo submits the stale task action
Then the request is rejected as a conflict or Flowable task error
And the UI tells demo to refresh the task list
```

Covers: `REQ-APP-009`.

## Test mapping

| Requirement | Java integration test | Playwright test |
|---|---:|---:|
| REQ-APP-001 | Yes | Yes |
| REQ-APP-002 | Yes | Yes |
| REQ-APP-003 | Yes | Yes |
| REQ-APP-004 | Yes | Yes |
| REQ-APP-005 | Yes | Yes |
| REQ-APP-006 | Yes | Yes |
| REQ-APP-007 | Yes | Yes |
| REQ-APP-008 | Yes | Yes |
| REQ-APP-009 | Yes | Yes |
| REQ-APP-010 | Yes | Yes |

The Java integration suite is the first implementation gate. The Playwright suite becomes the release gate once the browser workflow is available.

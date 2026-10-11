# API Strategy

## Public API base path

The public Flowable API is exposed under:

```text
/flowableplus-api
```

Native Flowable resource paths follow that base path, for example:

```text
GET  /flowableplus-api/repository/process-definitions
POST /flowableplus-api/runtime/process-instances
GET  /flowableplus-api/runtime/tasks
POST /flowableplus-api/runtime/tasks/{taskId}
GET  /flowableplus-api/form/form-data
```

## Native versus Plus endpoints

Use the native Flowable OSS REST API for engine capabilities. Add a separate Plus namespace only for capabilities that Flowable OSS does not provide:

```text
/flowableplus-api/*               native Flowable REST resources
/flowableplus-api/plus/*          Flowable Plus-specific resources, if required
```

The UI is allowed to depend directly on native Flowable response shapes. This is an intentional coupling decision, not an accidental implementation detail.

## Authentication

The first version uses browser form login and a session cookie. Login is handled by Spring Security; authenticated requests to the REST API use the same session.

The initial user must exist in both:

- Spring Security's in-memory user store
- Flowable's identity service

There is no tenant model or external identity provider in the first version.

## Authorization

The first authorization rules are:

- users may view process definitions available to the application;
- users may start the supported approval process;
- users may see tasks assigned to them or available to them as candidates;
- users may claim candidate tasks;
- users may complete tasks assigned to them;
- users may not complete tasks assigned to another user.

## Error behavior

The UI shows a top-level text banner for authentication failures, authorization failures, expired sessions, Flowable validation errors, and task conflicts.

Important HTTP responses:

- `401`: show a login/session-expired message.
- `403`: show an authorization message.
- `409`: explain that the task changed or was claimed by another user.
- other Flowable validation errors: display the server-provided message when safe.

## Compatibility

The Flowable version is managed centrally in the root Maven dependency management. REST contract tests cover the native endpoints used by the UI and are run when the Flowable version changes.

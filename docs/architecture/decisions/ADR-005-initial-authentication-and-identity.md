# ADR-005: Initial Authentication and Identity

Status: Accepted
Date: 2026-10-11

## Context

The first version needs login but does not yet need tenants, external identity providers, or a complete identity administration feature.

## Decision

Use browser form login with a session cookie. Define one development user in Spring Security's in-memory user store and mirror that user in Flowable's IdentityService so Flowable task assignment and candidate queries can use the same username.

The first authorization rules are:

- users may view available process definitions;
- users may start the supported approval process;
- users may see tasks assigned to them or available as candidates;
- users may claim candidate tasks;
- users may complete tasks assigned to them;
- users may not complete another user's task.

## Consequences

- The UI and REST API share the authenticated session.
- Flowable identity data and Spring Security credentials must remain aligned.
- The initial password is development-only and must not become a committed production secret.
- Tenant isolation and external identity providers remain future decisions.

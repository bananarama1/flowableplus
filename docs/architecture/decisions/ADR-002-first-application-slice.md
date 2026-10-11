# ADR-002: First Application Vertical Slice

Status: Accepted
Date: 2026-10-11

## Context

The project needs a small but complete application path before expanding into broad Work UI functionality.

## Decision

The first complete user journey is:

```text
log in
  -> view available pre-deployed process definitions
  -> select and start an approval process
  -> view the assigned task
  -> claim the task
  -> complete the task
  -> view the resulting process state
```

## Consequences

- Backend, REST, authentication, UI, database, and process model work is prioritized around one approval process.
- Features outside this journey should not delay the first usable version.
- The journey is the primary Playwright acceptance scenario.

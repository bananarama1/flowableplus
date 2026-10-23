# ADR-008: Local Filesystem Modeler

Status: Accepted
Date: 2026-10-23

## Context

Developers need an IDE-local modeler for Flowable Plus projects. Draft model files must remain in the project resource directory and should update immediately when edited by the IDE or another process.

## Decision

Provide the modeler as an opt-in `flowableplus-work-modeler` backend module and a separate `flowableplus-work-modeler-ui` Vite application. The backend reads and writes supported model XML directly under one configured root and watches that directory recursively.

The modeler is a local development tool. Its endpoints are unauthenticated, CSRF-exempt, and restricted to loopback requests by default. Compose publishes the development ports on localhost and may disable the backend loopback check because the request originates from the UI container.

The filesystem is the only model source of truth. The modeler does not use Flowable deployment services and does not create model or deployment database state. BPMN files receive diagram rendering; other supported model files are available for XML-only editing.

## Consequences

- The modeler is not part of the default work starter behavior unless explicitly enabled.
- The existing Work API remains authenticated.
- Model edits are immediately visible to other project tools through the filesystem.
- Deployment, collaboration, locking, version history, and production model administration are outside this POC.
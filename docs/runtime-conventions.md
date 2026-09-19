# Runtime Conventions

## Configuration

- Shared configuration keys use the `flowableplus.*` prefix when introduced by the platform.
- Application-specific keys use `flowableplus.modeler.*` or `flowableplus.work.*`.
- `application.properties` contains safe defaults. `application-local.properties` is activated with the `local` profile for developer startup and tests.
- Secrets and client runtime credentials are injected by the deployment environment and are never frontend configuration.

## Correlation and logging

- Requests accept and return `X-Correlation-Id`; an application generates one when the caller omits it.
- Structured logs use `correlationId`, `clientId`, `actorId`, `operation`, and `outcome` fields when those values are known.
- Publication requests also carry `X-FlowablePlus-Api-Version` and `Idempotency-Key`.

## Health

- Each executable application exposes `GET /health` independently.
- The response contains `application`, `status`, and `correlationId`; the work application also reports `flowableRuntime`.
- The compatibility endpoint `GET /flowable/status` remains available in `work-app` during the migration.
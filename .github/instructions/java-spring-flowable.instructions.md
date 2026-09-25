---
applyTo: "**/src/main/java/**/*.java,**/src/test/java/**/*.java"
---

# Java, Spring, and Flowable changes

- Keep controllers, application services, persistence, contracts, and Flowable adapters within their owning module. `modeler-app` owns design-time data and publication intent; `work-app` owns runtime execution and history; shared types belong in `platform-contracts`.
- Enforce client scope from the authenticated principal and the server-side client registry. Protected requests require authentication, authorization, and an explicit client scope; return the established 401, 403, and 404 behavior from [runtime API conventions](../../docs/runtime-api-conventions.md).
- Preserve the HTTP contract: structured errors, `X-Correlation-Id`, `X-FlowablePlus-Api-Version`, and `Idempotency-Key` are part of the boundary. Keep publication envelope and retry rules aligned with [publication contract](../../docs/publication-contract.md).
- Keep persistence ownership separate. Do not accept database URLs, credentials, schemas, or runtime targets from browser input or publication payloads; use server-side configuration described in [client runtime provisioning](../../docs/client-runtime-provisioning.md).
- Add focused tests at the owning module boundary for authorization, contract validation, persistence behavior, and Flowable execution. Treat testing as part of the change, and run the Maven wrapper verification used by [CI](../workflows/ci.yml) before considering a cross-module change complete.
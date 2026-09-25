---
name: publication-contract
description: Use when changing the modeler-to-work publication contract, publication envelope, compatibility headers, idempotency, client authorization, or related contract and integration tests. Do not use for frontend-only editor work, general runtime queries, or unrelated OpenSpec planning.
license: MIT
compatibility: Requires the FlowablePlus Maven build and the repository publication documentation.
metadata:
  author: FlowablePlus
---

# Publication contract workflow

Use this skill for changes crossing the authenticated modeler-to-work publication boundary.

1. Read [publication contract conventions](../../../docs/publication-contract.md), [runtime API conventions](../../../docs/runtime-api-conventions.md), and the [runtime-publication OpenSpec specification](../../../openspec/specs/runtime-publication/spec.md) before changing a DTO, controller, client, or persistence record.
2. Preserve the compatibility headers: `X-FlowablePlus-Api-Version`, `X-Correlation-Id`, and `Idempotency-Key`. Keep required identity, immutable version, document, model type, and correlation fields validated as a complete `PublicationEnvelope` with the repository's structured error shape.
3. Preserve idempotency for the client, model key, immutable version, and idempotency key. A repeated request returns the existing publication result and does not create a second runtime deployment; a failed publication does not replace the previous active version.
4. Enforce authentication, publish authorization, and explicit target client scope at the receiving boundary. Reject cross-client publication before deployment and do not accept database credentials, schemas, or runtime targets from the envelope or browser.
5. Add or update the narrowest contract, modeler, work, persistence, and integration tests that prove both the success path and rejection path. Keep the modeler bearer token server-side and preserve correlation data in the response and publication record.
6. Run `./mvnw -B -ntp verify` as used by [CI](../../workflows/ci.yml). For a cross-application change, also run the documented local publication sequence in [developer setup](../../../docs/developer-setup.md) when PostgreSQL and both applications are available.

## Validation outcome

The change is valid only when Maven verification passes, complete envelopes are accepted, malformed or cross-client requests are rejected without deployment, and duplicate requests return one existing publication result.
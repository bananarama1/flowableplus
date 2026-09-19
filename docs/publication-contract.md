# Publication Contract Conventions

The modeler-to-work HTTP boundary uses the following compatibility headers:

| Header | Rule |
| --- | --- |
| `X-FlowablePlus-Api-Version` | Required API major version; first release is `1`. |
| `X-Correlation-Id` | Required request tracing identifier, echoed in the response and publication record. |
| `Idempotency-Key` | Required stable retry key for one client, model key, and immutable version. |

The JSON body is a `PublicationEnvelope`. The work application rejects missing identity, version, document, correlation, or idempotency data with `StructuredError` values. It also rejects model/document type mismatches and model/version identity mismatches.

Repeated requests carrying the same client, model key, immutable version, and idempotency key are one logical publication. The existing result is returned and a second runtime deployment is not created.
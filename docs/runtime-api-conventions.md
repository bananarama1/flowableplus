# Runtime API Conventions

## First-release query behavior

- Collection endpoints accept `page` (zero-based, default `0`) and `size` (default `50`, maximum `200`).
- Results are sorted by stable identifier ascending unless an endpoint documents another default. Clients may request only allowlisted sort fields; unknown fields are rejected.
- Filters are exact-match for client scope, model key, state, and assignee. Empty filters mean no additional restriction, never unrestricted client access.
- Empty collections return HTTP 200 with an empty `items` array and a `total` of `0`.
- Oversized requests are rejected with a structured validation error rather than silently truncating the requested page.

## Authorization and client scope

- Protected requests require an authenticated actor and an explicit client scope.
- Unauthorized or cross-client resources return HTTP 404 to avoid confirming the existence of protected identifiers. They do not include variables, form metadata, or history details.
- Missing authentication returns HTTP 401; an authenticated actor without the required operation permission returns HTTP 403.

## History retention

- Runtime history is retained for the configured production retention period, defaulting to 365 days.
- Active instances remain queryable regardless of age. Completed history older than the retention period may be purged by an operational job.
- Purged history returns the same not-found behavior as an unauthorized resource.
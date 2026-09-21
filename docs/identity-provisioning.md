# Identity Provisioning and Recovery

## Initial release

The platform uses application-managed users with bearer tokens in the local profile. A user has an identity, client memberships, and application roles; database credentials and Flowable credentials are never exposed through the API.

The local profile seeds `alice` as a `WORK_USER` for `client-local` and `modeler` as `MODEL_EDITOR` and `PUBLISHER` for `client-local`. These accounts exist only for local development and tests. Production deployments must disable the local seed accounts and provide users through the provisioning API or an OIDC/OAuth2 adapter.

## Provisioning workflow

1. An administrator authenticates through the configured identity provider or administrator endpoint.
2. The administrator creates the user, assigns one or more client memberships, and assigns application roles.
3. The application stores the user and membership records through its normal persistence service and emits an audit event for the provisioning operation.
4. The user obtains a short-lived bearer token from `/api/auth/token` in local development, or from the configured external identity provider in production.
5. Every protected request is checked for authentication, client membership, and operation permission before data is returned or state changes.

No normal provisioning step requires a manual SQL insert or direct Flowable database edit.

## Credential recovery

Local development credentials are reset by changing the configured seed password and restarting the application. Production credentials are recovered through the configured identity provider's password-reset flow. The platform does not expose or persist plaintext passwords and does not provide a database-edit recovery shortcut.

When an external identity provider is introduced, the stable application user identifier and client memberships remain local platform data; only authentication and credential recovery move to the provider.

## Operational safeguards

- Tokens are short-lived and stateless at the API boundary.
- Client membership is checked independently of role membership.
- Modeler and work permissions remain separate even when a user has both sets of roles.
- Authorization failures are recorded with actor, client, target, operation, outcome, and correlation id when an authenticated principal is available.

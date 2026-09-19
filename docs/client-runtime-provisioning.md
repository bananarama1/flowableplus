# Client Runtime Provisioning

Each client is assigned one `ClientRuntimeTarget` containing a runtime id, database schema, and server-side publication base URL. The client registry resolves this target before any deployment or runtime operation; unknown clients fail closed.

The work application uses the `flowableplus.work.runtime.database-schema-update` setting for the selected runtime configuration:

- `validate` is the default and is required for production-like environments after migrations have run.
- `create-drop` is enabled only by the `local` profile for disposable developer and test databases.
- Production provisioning runs Flowable schema migrations for each client database before the runtime is made available.

The database URL, username, password, and secret references remain server-side deployment configuration. They are not fields in publication envelopes, frontend configuration, or public runtime target responses.
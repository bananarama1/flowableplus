# Client Runtime Provisioning

Each client is assigned one `ClientRuntimeTarget` containing a runtime id, database schema, and server-side publication base URL. The client registry resolves this target before any deployment or runtime operation; unknown clients fail closed.

The work application uses the `flowableplus.work.runtime.database-schema-update` setting for the selected runtime configuration:

- `validate` is the default and is required for production-like environments after migrations have run.
- The `local` profile uses PostgreSQL with Flowable schema update enabled for the disposable developer runtime documented in `docs/developer-setup.md`.
- Production provisioning runs Flowable schema migrations for each client database before the runtime is made available.

The local Compose bootstrap creates `flowableplus_work` and its `flowable_local`
schema, then maps `client-local` to `runtime-local`. `docker compose down -v`
removes this local database and its data. Additional client provisioning and
production migration automation remain part of operational hardening.

The database URL, username, password, and secret references remain server-side deployment configuration. They are not fields in publication envelopes, frontend configuration, or public runtime target responses.
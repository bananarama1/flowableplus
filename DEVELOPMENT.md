# Local development

Docker Compose is the canonical local development environment. Docker Desktop
is the only prerequisite.

## Run the application

From the repository root:

```text
docker compose up --build --watch
```

The application is available at <http://localhost:8080>. The Work UI is
available at <http://localhost:3000>. Changes under the example application,
model, and UI source directories are synchronized into the development
containers and trigger a restart or rebuild. Maven artifacts are stored in a
named volume so subsequent starts do not download them again.

The Compose stack also starts PostgreSQL and Mailpit for local infrastructure:

- PostgreSQL: `localhost:5432`, database `flowable`, user `flowable`, password `flowable`
- Mailpit UI: <http://localhost:8025>
- SMTP: `localhost:1025`

The application uses its in-memory H2 configuration for local development. The
PostgreSQL and Mailpit services are provisioned and ready for manual testing.

The UI is a Vite React application in `flowableplus-work-ui`. Its `/api` proxy
routes to the Spring application service, so the browser can use the UI without
requiring local CORS configuration.

The same workflow is available through `scripts/dev-up.ps1` on PowerShell or
`scripts/dev-up.sh` on Bash. Compose watch mode runs in the foreground; do not
combine it with `-d`.

## Run tests

Fast unit and slice tests run with:

```text
./mvnw test
```

Integration tests use PostgreSQL and Mailpit Testcontainers. They start their
own disposable infrastructure and run consistently both locally and in CI

```text
./mvnw verify
```

Docker must be running for integration tests. Integration tests use the `*IT`
filename convention and are executed by Maven Failsafe during `verify`.

The cross-platform test wrappers are `scripts/test.ps1` and `scripts/test.sh`.

## Debug tests

Tests run in forked JVMs, separately from the application JVM. Use the scripts
below to suspend the test JVM until a debugger attaches on `localhost:5005`:

```powershell
.\scripts\debug-unit-tests.ps1
.\scripts\debug-integration-tests.ps1
```

Bash:

```bash
./scripts/debug-unit-tests.sh
./scripts/debug-integration-tests.sh
```

Attach the debugger after the command pauses. The unit-test script runs the
example application's Surefire tests. The integration-test script runs the
Flowable platform tests through Failsafe and requires Docker for Testcontainers.
Do not run the application debug script on the same port at the same time.

## Debug the application

PowerShell:

```powershell
$env:DEBUG = "true"
docker compose up --build --watch
```

Bash:

```bash
DEBUG=true docker compose up --build --watch
```

In VS Code, start the `Attach to Docker app` launch configuration after the
application is running. The debugger listens on `localhost:5005`.

To make startup wait for the debugger, set `DEBUG_SUSPEND` to `y` before
starting Compose.

## Stop the environment

```text
docker compose down
```

The equivalent wrappers are `scripts/stop.ps1` and `scripts/stop.sh`.

Named volumes are retained. To also remove local PostgreSQL data and the Maven
cache, use `docker compose down --volumes`.
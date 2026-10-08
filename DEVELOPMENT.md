# Local development

Docker Compose is the canonical local development environment. Docker Desktop
is the only prerequisite.

## Run the application

From the repository root:

```text
docker compose up --build --watch
```

The application is available at <http://localhost:8080>. Changes under the
application and example-model source directories are synchronized into the
development container and trigger a restart. Maven artifacts are stored in a
named volume so subsequent starts do not download them again.

The Compose stack also starts PostgreSQL and Mailpit for local infrastructure:

- PostgreSQL: `localhost:5432`, database `flowable`, user `flowable`, password `flowable`
- Mailpit UI: <http://localhost:8025>
- SMTP: `localhost:1025`

The application uses its in-memory H2 configuration for local development. The
PostgreSQL and Mailpit services are provisioned and ready for manual testing.

## Run tests

Fast unit and slice tests run with:

```text
./mvnw test
```

Integration tests use PostgreSQL and Mailpit Testcontainers. They start their
own disposable infrastructure and run consistently both locally and in CI:

```text
./mvnw verify
```

Docker must be running for integration tests. Integration tests use the `*IT`
filename convention and are executed by Maven Failsafe during `verify`.

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

Named volumes are retained. To also remove local PostgreSQL data and the Maven
cache, use `docker compose down --volumes`.
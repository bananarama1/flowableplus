# Developer Setup

This guide starts the modeler and work applications as separate Spring Boot
processes and uses PostgreSQL for local persistence.

## Local topology

```text
browser --> modeler-app http://localhost:8080
              |
              +------ authenticated publication ------> work-app http://localhost:8081
                                                         |
                                                         +--> PostgreSQL, client-local runtime
```

The modeler owns design-time data in `flowableplus_modeler`. The work app owns
Flowable data in `flowableplus_work`, using the `flowable_local` schema for the
`client-local` runtime. The database is the only service started by Compose;
the two applications remain independently runnable Maven processes.

## Prerequisites

- Java 17
- Docker Desktop with Compose
- Node.js and npm only when rebuilding the modeler editor bundle

Do not use the local database password outside development. Production secrets
must be injected by the deployment environment and must not be placed in
frontend configuration, publication envelopes, or committed files.

## Start PostgreSQL

From the repository root:

```powershell
docker compose up -d postgres
docker compose ps
```

The first startup creates the `flowableplus_modeler` database and the
`flowable_local` schema in `flowableplus_work`. To recreate this disposable
database after changing the initialization SQL:

```powershell
docker compose down -v
docker compose up -d postgres
```

The `-v` option deletes local development data only.

## Start both applications

Open two PowerShell terminals in the repository root.

Terminal 1, modeler:

```powershell
.\mvnw.cmd -pl modeler-app spring-boot:run '-Dspring-boot.run.profiles=local'
```

Terminal 2, work app:

```powershell
.\mvnw.cmd -pl work-app spring-boot:run '-Dspring-boot.run.profiles=local'
```

Verify both services before using the APIs:

```powershell
Invoke-RestMethod http://localhost:8080/health
Invoke-RestMethod http://localhost:8081/health
Invoke-RestMethod http://localhost:8081/flowable/status
```

Expected application URLs:

| Application | URL | Health |
| --- | --- | --- |
| Modeler | `http://localhost:8080` | `http://localhost:8080/health` |
| Work | `http://localhost:8081` | `http://localhost:8081/health` |
| Work publication intake | `http://localhost:8081/api/publications` | N/A |

## Local identity

The local profile seeds these development-only accounts in the work app:

| User | Password | Client | Use |
| --- | --- | --- | --- |
| `modeler` | `local-password` | `client-local` | Publish models |
| `alice` | `local-password` | `client-local` | Start work and complete tasks |

Obtain short-lived bearer tokens without placing passwords in source files:

```powershell
$modelerToken = (Invoke-RestMethod http://localhost:8081/api/auth/token `
  -Method Post -ContentType 'application/json' `
  -Body '{"username":"modeler","password":"local-password"}').accessToken

$workerToken = (Invoke-RestMethod http://localhost:8081/api/auth/token `
  -Method Post -ContentType 'application/json' `
  -Body '{"username":"alice","password":"local-password"}').accessToken
```

These variables exist only in the current PowerShell session. Do not commit
tokens or copy them into application properties.

## BPMN vertical slice

The following API sequence creates a draft, publishes it through the modeler
to the work app, starts a process, completes its user task, and reads audit
history. It is intentionally API-driven so the cross-application contract is
visible and reproducible without manual frontend state.

Create a project:

```powershell
$project = Invoke-RestMethod 'http://localhost:8080/api/modeler/projects?clientId=client-local' `
  -Method Post -ContentType 'application/json' `
  -Body '{"modelKey":"developer-review","modelType":"BPMN","displayName":"Developer review","ownerId":"modeler"}'
```

Save a draft. The XML uses the authenticated worker as the user-task assignee
so the task is immediately visible in the worker inbox.

```powershell
$xml = '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:flowable="http://flowable.org/bpmn"><process id="developer-review" name="Developer review" isExecutable="true"><startEvent id="start"/><sequenceFlow id="flow-1" sourceRef="start" targetRef="review"/><userTask id="review" name="Review" flowable:assignee="alice"/><sequenceFlow id="flow-2" sourceRef="review" targetRef="end"/><endEvent id="end"/></process></definitions>'
$draft = Invoke-RestMethod ('http://localhost:8080/api/modeler/projects/' + $project.id + '/versions?clientId=client-local') `
  -Method Post -ContentType 'application/json' -Body (@{ xml = $xml } | ConvertTo-Json)
```

Validate and publish the immutable version. The modeler forwards the bearer
token to the work publication endpoint and the actor must match `modeler`.

```powershell
$correlationId = [guid]::NewGuid().ToString()
$validation = Invoke-RestMethod ('http://localhost:8080/api/modeler/versions/' + $draft.id + '/validate?clientId=client-local') `
  -Method Post -ContentType 'application/json' `
  -Body (@{ modelType = 'BPMN'; formSchema = $null; correlationId = $correlationId } | ConvertTo-Json)

$publication = Invoke-RestMethod ('http://localhost:8080/api/modeler/versions/' + $draft.id + '/publish?clientId=client-local') `
  -Method Post -Headers @{ Authorization = "Bearer $modelerToken" } `
  -ContentType 'application/json' `
  -Body (@{ modelType = 'BPMN'; formSchema = $null; correlationId = $correlationId; actorId = 'modeler' } | ConvertTo-Json)
```

Start the active definition, inspect the task, and complete it:

```powershell
$instance = Invoke-RestMethod 'http://localhost:8081/api/runtime/processes/developer-review/instances?clientId=client-local' `
  -Method Post -Headers @{ Authorization = "Bearer $workerToken" } `
  -ContentType 'application/json' -Body '{}'

$tasks = Invoke-RestMethod 'http://localhost:8081/api/runtime/tasks?clientId=client-local' `
  -Headers @{ Authorization = "Bearer $workerToken" }
$taskId = $tasks[0].taskId

Invoke-RestMethod ('http://localhost:8081/api/runtime/tasks/' + $taskId + '/complete?clientId=client-local') `
  -Method Post -Headers @{ Authorization = "Bearer $workerToken" } `
  -ContentType 'application/json' -Body '{}'

Invoke-RestMethod ('http://localhost:8081/api/runtime/process-instances/' + $instance.processInstanceId + '/history?clientId=client-local') `
  -Headers @{ Authorization = "Bearer $workerToken" }

Invoke-RestMethod 'http://localhost:8081/api/runtime/audit?clientId=client-local' `
  -Headers @{ Authorization = "Bearer $workerToken" }
```

The expected result is an `ACTIVE` publication, a created process instance,
one `alice` task, a successful task completion, and audit records for
publication, process start, and task completion.

## Frontend assets

Both applications serve their own checked-in assets. The modeler editor bundle
can be rebuilt after changing its JavaScript source:

```powershell
Push-Location modeler-app/frontend
npm install
npm run build
Pop-Location
```

The work frontend has no separate build step in the first release.

## Client-runtime provisioning boundary

The local profile bootstraps exactly one target:

| Client | Runtime | Database | Schema |
| --- | --- | --- | --- |
| `client-local` | `runtime-local` | `flowableplus_work` | `flowable_local` |

The client id is resolved server-side by the work app. Database credentials
and schema details are not accepted from the browser or publication payload.
Additional client runtime provisioning and production migrations remain
operational hardening work; the two-client isolation behavior is covered by
the integration tests rather than this one-client developer walkthrough.
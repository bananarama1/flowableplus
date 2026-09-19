# First-Release Metadata and Form Schema

The published metadata contract is versioned independently from BPMN and CMMN XML. The first release uses schema version `1`.

## Model metadata

Every published model carries:

- `clientScope.clientId`: the owning client.
- `modelKey`: the stable process or case family key.
- `modelType`: `BPMN` or `CMMN`.
- `displayName`: the user-facing model name.
- `version`: an immutable positive version number.
- `startable`: whether the current active version can be started normally.
- `assignments`: user or group identifiers for supported human work.
- `variables`: named variables with a supported primitive or JSON object type.
- `startInputs`: the variables accepted when a process or case starts.

## Form schema version 1

```json
{
  "schemaVersion": "1",
  "fields": [
    {
      "id": "days",
      "label": "Days",
      "type": "INTEGER",
      "required": true,
      "initialValue": 1,
      "variableName": "leaveDays",
      "options": []
    }
  ]
}
```

Supported field types are `TEXT`, `TEXTAREA`, `INTEGER`, `DECIMAL`, `BOOLEAN`, `DATE`, `DATE_TIME`, and `SELECT`. Every field requires an id, label, type, and variable mapping. Required fields are enforced by the work backend. Select fields additionally require stable option values. Initial values must match the declared type.

The first-release variable types are string, integer, decimal, boolean, date-time, and JSON object. User and group assignments are identifiers resolved by application-managed identity; arbitrary expressions, scripts, custom widgets, file uploads, and rich text are not accepted by schema version `1`.
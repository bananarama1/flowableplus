# Local Modeler POC

The modeler is an IDE-local development surface backed by a configured filesystem resource directory. It does not persist model definitions in a database and does not deploy models to Flowable.

## Requirements

### REQ-MOD-001: Local access

The modeler UI and API MUST work without a login flow. The backend MUST reject non-loopback modeler requests when local-only mode is enabled, while existing Work API authentication remains unchanged.

### REQ-MOD-002: Model discovery

The modeler MUST list supported Flowable model files below the configured resource root, including nested directories, without exposing absolute filesystem paths.

### REQ-MOD-003: XML editing

The modeler MUST read and write model XML using stable relative file keys. Writes MUST be atomic and MUST preserve the previous file when XML validation fails.

### REQ-MOD-004: Live filesystem changes

Changes made outside the UI MUST advance a model revision so the UI can reload the current file without restarting Spring Boot.

### REQ-MOD-005: BPMN representation

The UI MUST show a BPMN representation for BPMN files with diagram interchange data. Supported non-BPMN model files MUST remain available in an XML-only view.

### REQ-MOD-006: Filesystem safety

The API MUST reject traversal, absolute paths, unsupported extensions, and symlinks that escape the configured root.

### REQ-MOD-007: No database persistence

Modeler read, write, and watcher operations MUST NOT call Flowable deployment services or write model/deployment state to a database.
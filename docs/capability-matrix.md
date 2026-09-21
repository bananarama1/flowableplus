# First-Release BPMN/CMMN Capability Matrix

Publication validation uses this matrix before a definition can become active. Each row has an explicit outcome so unsupported behavior cannot silently reach the work application.

## BPMN

The first-release BPMN editor uses `bpmn-js` and exposes only the supported runtime surface: start/end/terminate events, user tasks, approved built-in service tasks, exclusive/parallel gateways, sequence flows, supported timers, assignments, variables, and form references. The original XML is authoritative; round-trip import/export must preserve unknown Flowable extension elements and attributes even when the editor does not expose them for editing.

| Capability | Outcome | Publish-time rule |
| --- | --- | --- |
| None, start, end, and terminate events | Supported | Validate event identifiers and legal sequence flows. |
| User tasks | Supported | Require a stable task identifier and supported assignment/form metadata. |
| Service tasks using configured Flowable behavior | Supported | Allow only approved built-in behavior; reject arbitrary Java or script execution. |
| Exclusive and parallel gateways | Supported | Validate gateway connectivity and expressions against the approved expression subset. |
| Inclusive and event-based gateways | Deferred | Reject for first-release publication until runtime tests define the supported subset. |
| Sequence flows | Supported | Validate source and target references. |
| Timers on supported activities and boundary events | Supported | Accept ISO-8601 duration/date forms; reject unsupported calendar expressions. |
| Message, signal, and escalation events | Deferred | Reject until correlation and cross-instance semantics are specified. |
| Call activities and event subprocesses | Deferred | Reject until deployment dependency and lifecycle behavior are specified. |
| Start variables | Supported | Validate against the versioned input variable schema. |
| Process variables | Supported | Allow string, integer, decimal, boolean, date-time, and JSON object values. |
| Unsupported variable types or executable expressions | Rejected | Return an actionable validation error before publication. |
| User-task assignments to users and groups | Supported | Validate references against the application-managed identity model. |
| Generic task forms | Supported | Require the versioned form schema and supported field types below. |

## CMMN

The first-release CMMN editor uses a constrained custom authoring surface with CMMN 1.1 XML parsing/serialization through `cmmn-moddle`; the archived `cmmn-js` renderer is not adopted as a maintained runtime dependency. The supported authoring surface is stages, human tasks, sentries with approved conditions, milestones, supported timers, case variables, and user/group assignments. Unknown CMMN and Flowable extension elements and attributes must survive round-trip editing, while backend validation remains the publication compatibility gate.

| Capability | Outcome | Publish-time rule |
| --- | --- | --- |
| Case and case plan model | Supported | Require stable case and plan identifiers. |
| Stages | Supported | Validate nesting and plan-item references. |
| Human tasks | Supported | Require a stable task identifier and supported assignment/form metadata. |
| Milestones | Supported | Validate entry criteria and completion semantics through Flowable integration tests. |
| Sentries with approved conditions | Supported | Allow only the documented condition subset. |
| Timers on supported plan items | Supported | Accept ISO-8601 duration/date forms; reject unsupported calendar expressions. |
| Case variables | Supported | Use the same versioned primitive and JSON variable types as BPMN. |
| Case start inputs | Supported | Validate against the published case input schema. |
| User and group assignments | Supported | Validate references against the application-managed identity model. |
| Repetition, discretionary items, and advanced event listeners | Deferred | Reject until representative runtime behavior is covered. |
| Custom scripts, arbitrary Java delegates, and unsupported expressions | Rejected | Return an actionable compatibility error before activation. |

## Form metadata

| Capability | Outcome | Publish-time rule |
| --- | --- | --- |
| Text, multiline text, integer, decimal, boolean, date, date-time, and select fields | Supported | Require field id, label, type, and variable mapping. |
| Required fields and initial values | Supported | Validate type compatibility and preserve values in the published schema. |
| Select options | Supported | Require stable option values and labels. |
| User/group picker, file upload, rich text, and custom widgets | Deferred | Reject until storage, security, and frontend behavior are specified. |
| Arbitrary client-side code or process-specific frontend components | Rejected | Generic work UI must not execute model-supplied code. |

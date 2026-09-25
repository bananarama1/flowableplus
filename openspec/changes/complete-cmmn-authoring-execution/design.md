# Design

## Context

The modeler uses `cmmn-moddle` to parse and serialize CMMN but currently presents a source-oriented notice and inserts XML by string replacement. The work application already has case start and case history controller routes plus Flowable adapter types, but the complete CMMN authoring-to-runtime path is not demonstrated by a representative test.

## Goals / Non-Goals

**Goals:**

- Provide a constrained, structured CMMN authoring workflow aligned with the capability matrix.
- Keep original XML and unknown extension data round-trippable.
- Publish and execute one representative supported case through the real Flowable CMMN services.
- Make unsupported constructs fail before activation with actionable diagnostics.

**Non-Goals:**

- Reviving or introducing an archived general-purpose CMMN renderer/editor dependency.
- Supporting discretionary items, event listeners, arbitrary scripts, or unsupported expressions.
- Expanding the form builder or changing the BPMN vertical slice contract.

## Decisions

### 1. Use a constrained structured surface backed by CMMN moddle

Represent supported stages, human tasks, sentries, milestones, timers, variables, and assignments as explicit editor operations over a parsed moddle model. Serialize through the moddle writer after each committed edit; do not manipulate XML with string replacement.

Alternative considered: add `cmmn-js` for visual editing. Rejected because the dependency is archived and the first release requires a compatibility-focused constrained surface.

### 2. Preserve source extensions through a parse-edit-write pipeline

Keep the parsed root and unknown extension nodes available when updating known elements. Add representative fixtures containing Flowable and custom extensions, and assert preservation after editing a known case element and serializing.

Alternative considered: rebuild the entire document from a simplified internal model. Rejected because it would silently discard extensions and violate the source-of-truth contract.

### 3. Gate runtime activation with the same capability matrix

The modeler validator and work-app publication compatibility validator share the declared supported/rejected outcomes. The work app remains authoritative at activation time, so a document that bypasses the modeler still cannot activate unsupported CMMN behavior.

### 4. Prove the case path with one deterministic fixture

Use a case containing a stage, human task, case variable, and approved entry/exit conditions or timer behavior. Test publication, case start, case history, and client isolation. Add more elements only when the capability matrix and runtime fixture demonstrate support.

## Risks / Trade-offs

- **Moddle does not retain every unknown construct automatically:** add fixtures before implementation and fail the round-trip test rather than silently dropping data.
- **CMMN engine behavior differs between local and production database profiles:** run the case integration test against the supported relational profile as well as lightweight local tests.
- **Sentry/timer semantics are easy to overstate:** publish only the subset covered by executable runtime tests and mark the rest deferred.
- **Case APIs use process-oriented naming or DTOs:** keep the public contract case-specific and adapt internally at the Flowable boundary.
# Design

## Context

The repository is a Java 17 multi-module Maven project with Spring Boot 4.0.2 and Flowable 8.0.0. `modeler-app` and `work-app` are separate applications, while `platform-contracts` and `platform-flowable` provide shared boundaries. The modeler editor uses JavaScript, esbuild, and BPMN/CMMN libraries; the work frontend uses Node tests and Playwright browser tests.

The repository already contains six OpenSpec workflow skills and matching prompt wrappers. It has no project-wide Copilot instructions, file-scoped instructions, or custom agents. Existing domain guidance lives in `docs/`, and CI is the authoritative source for the main Maven and frontend validation commands. The current `openspec/config.yaml` contains only the schema declaration and has no project rules that require future changes to assess agent guidance.

## Goals / Non-Goals

**Goals:**

- Make stable project boundaries available without requiring repeated repository discovery.
- Apply Java, frontend, and OpenSpec guidance only to matching files.
- Add skills for recurring workflows that require multiple steps and have a clear completion check.
- Keep descriptions keyword-rich enough for reliable discovery.
- Prevent duplicate, vague, or always-loaded customization.
- Make agent-guidance impact an explicit, reviewable decision in future OpenSpec proposals.
- Keep behavioral requirements authoritative in OpenSpec specs while allowing concise, traceable projections in agent guidance.

**Non-Goals:**

- Change application code, runtime behavior, APIs, persistence, deployment, or CI.
- Duplicate the contents of existing architecture and developer documentation.
- Replace or rewrite the existing OpenSpec workflow skills.
- Add a custom agent until a role needs distinct tools, context isolation, or handoffs.
- Add hooks or generated scripts solely to make the customization appear more complete.

## Decisions

### Use the smallest customization set

Create one always-on `.github/copilot-instructions.md` for stable repository facts, three file-scoped instruction files, and three on-demand skills. The initial files are:

- `.github/copilot-instructions.md`
- `.github/instructions/java-spring-flowable.instructions.md`
- `.github/instructions/frontend.instructions.md`
- `.github/instructions/openspec.instructions.md`
- `openspec/config.yaml` project context and artifact rules for the maintenance gate
- `.github/skills/publication-contract/SKILL.md`
- `.github/skills/work-vertical-slice/SKILL.md`
- `.github/skills/module-validation/SKILL.md`

Do not create `.github/agents/` in this change. A reviewer persona can be added later if actual usage shows a stable need for different tools or context isolation.

### Make agent impact a required planning decision

Update `openspec/config.yaml` with concise project context and rules for proposal and task artifacts. Future proposals must contain an `## Agent Impact` section with one of these outcomes: no instruction or skill changes required; an existing customization must be updated; or a new customization is required. When impact is non-zero, the proposal must list affected files and the tasks must include their update and validation. The rule requires an assessment, not automatic file creation, so it prevents silent drift without encouraging unnecessary skills.

The OpenSpec instruction file repeats this policy in operational language: inspect `.github/copilot-instructions.md`, `.github/instructions/`, and `.github/skills/` when conventions or workflows change; update existing guidance before creating new files; link to authoritative documentation; and record no impact when the inspection finds no relevant change.

### Separate behavioral truth from agent guidance

Use three distinct ownership rules:

- OpenSpec `spec.md` owns observable product behavior, requirements, and acceptance scenarios.
- Copilot instructions own stable implementation constraints such as client-scope authorization, secret handling, and source-of-truth locations.
- Skills own repeatable procedures, commands, and validation outcomes.

Instructions and skills may repeat a high-risk invariant when doing so prevents an implementation mistake, but they must link to the relevant spec or documentation and must not copy complete requirements or scenarios. When behavior changes, update the spec first and then revise derived guidance if the implementation consequence changed. When only a workflow or coding convention changes, update guidance without inventing a product-spec delta.

### Keep always-loaded guidance short

The global file contains only architecture boundaries, security constraints, source-of-truth locations, and links to existing docs. It does not contain detailed API examples, complete test procedures, or copied specifications. File instructions carry language- or artifact-specific rules through precise `applyTo` patterns.

### Treat skills as executable workflows

Each skill must have a matching folder and `SKILL.md`, a keyword-rich `description` beginning with a clear use condition, ordered steps, and a validation outcome. Skills may link to existing repository docs, but they do not copy those docs or create reference files unless a reusable script or template is genuinely needed.

The proposed skills have distinct boundaries:

- `publication-contract` covers changes to the modeler-to-work publication boundary, required headers, envelope validation, idempotency, and client authorization.
- `work-vertical-slice` covers validating the published BPMN path through process start, task inbox, task completion, and audit history.
- `module-validation` routes a change to the narrow Maven, frontend, build, or browser checks already represented in CI.

### Prefer existing validation commands

Guidance must reference the Maven wrapper, the existing frontend `npm` scripts, and the documented local service topology. It must not introduce a second command vocabulary. The implementation should validate customization structure and then run the relevant existing checks; no application test changes are needed for these documentation-only files.

### Use explicit non-duplication gates

Before creating each instruction or skill, compare its subject with existing `.github/skills/openspec-*`, `.github/prompts/opsx-*`, and the linked `docs/` files. Reject a file when it only restates an existing artifact, lacks a distinct trigger, has no actionable procedure, or has no observable validation result.

## Risks / Trade-offs

- [Risk] Global instructions consume context on every task. -> Mitigation: keep them concise and move language- and workflow-specific material into scoped files.
- [Risk] Similar descriptions cause the wrong skill to load. -> Mitigation: use distinct trigger vocabulary and state explicit non-use cases in each description.
- [Risk] Guidance becomes stale as build or API conventions evolve. -> Mitigation: link to existing docs and CI commands, and include a maintenance task to review customization when those sources change.
- [Risk] A workflow skill may encourage expensive end-to-end checks for a small edit. -> Mitigation: order checks from narrow to broad and require the skill to identify the touched module first.
- [Risk] Customization frontmatter may be syntactically valid but undiscoverable. -> Mitigation: verify folder/name alignment, descriptions, `applyTo` patterns, and on-demand skill discoverability during validation.
- [Risk] OpenSpec artifact rules are advisory and could be ignored by another workflow. -> Mitigation: repeat the maintenance gate in `.github/instructions/openspec.instructions.md` and validate that the configured proposal instructions expose the rule.
- [Risk] Repeated behavioral statements drift between specs and guidance. -> Mitigation: define the spec as the behavioral authority, require links from derived guidance, and review repeated statements as projections rather than independent requirements.

## Migration Plan

1. Add the OpenSpec project context and Agent Impact artifact rules.
2. Add the global and file-scoped instructions, including the operational maintenance and source-of-truth rules.
3. Add the three narrowly scoped skills without modifying existing OpenSpec skills.
4. Inspect all frontmatter and descriptions for correct locations, names, patterns, and trigger terms.
5. Verify the proposal instruction output exposes the Agent Impact rule and run targeted repository checks.
6. Record any future customization requests as evidence-based additions rather than expanding these files preemptively.

## Open Questions

None. The initial design intentionally defers custom agents, hooks, bundled scripts, and additional domain-specific skills until repeated usage demonstrates that they remove real work.

---
applyTo: "openspec/**/*.md,openspec/**/*.yaml,openspec/**/*.yml"
---

# OpenSpec artifact editing

- Use the OpenSpec CLI to inspect the selected root, change status, artifact instructions, and validation. Read the returned `contextFiles`, rules, and dependencies before editing an artifact.
- Preserve dependency order: establish the proposal, define a behavior delta when one exists, record design decisions, then derive implementation tasks. Do not use tasks to invent requirements that are absent from the proposal, design, or authoritative specs.
- Capability specs are deltas, not copies of the main spec. Use the repository's `Requirement`, `Scenario`, and `ADDED`/`MODIFIED`/`REMOVED` conventions; if observable behavior is unchanged, keep `skip_specs: true` and do not add a capability spec.
- Keep planning separate from implementation. Proposal, spec, design, and task edits authorize planning artifacts only; implementation starts through the apply workflow and must follow the task list.
- Every proposal must include `## Agent Impact` with a deliberate no-impact decision or the affected `.github/copilot-instructions.md`, `.github/instructions/`, and `.github/skills/` files plus corresponding implementation and validation tasks. Inspect existing guidance before adding a new file.
- OpenSpec specs own observable behavior and acceptance scenarios. This source-of-truth ownership is distinct from instructions, which own concise implementation constraints, and skills, which own repeatable procedures and checks. Link repeated high-risk invariants to their authoritative spec or [repository documentation](../../docs/) instead of copying requirements.
- Keep this file focused on artifact policy. Use the existing [OpenSpec prompts](../prompts/opsx-propose.prompt.md) and [OpenSpec skills](../skills/openspec-propose/SKILL.md) for workflow mechanics.
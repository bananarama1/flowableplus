# Tasks

## 1. Add scoped project instructions

- [ ] 1.1 Create `.github/copilot-instructions.md` with concise Java 17, Spring Boot, Flowable, module-boundary, client-scope, secret-handling, OpenSpec, and source-of-truth guidance; verify it contains no `applyTo` frontmatter, copied API walkthroughs, or implementation instructions.
- [ ] 1.2 Create `.github/instructions/java-spring-flowable.instructions.md` for Java and Spring/Flowable changes with a precise `applyTo` pattern and actionable authorization, API, persistence, and testing rules; verify its pattern matches Java sources without applying to the whole workspace.
- [ ] 1.3 Create `.github/instructions/frontend.instructions.md` for modeler and work frontend JavaScript with a precise frontend `applyTo` pattern, existing npm scripts, and browser-test conventions; verify it does not impose Java or backend guidance.
- [ ] 1.4 Create `.github/instructions/openspec.instructions.md` for OpenSpec artifact editing, including dependency order, delta-spec discipline, planning-versus-implementation boundaries, the required Agent Impact assessment, and the rule that specs own behavior while guidance owns constraints and procedures; verify it does not duplicate the existing OpenSpec prompt or skill bodies.
- [ ] 1.5 Update `openspec/config.yaml` with concise project context and proposal/task rules requiring an `## Agent Impact` decision, affected customization files when applicable, corresponding implementation tasks, and source-of-truth classification for repeated guidance; verify the YAML remains valid and the rules do not change the configured schema.

## 2. Add narrowly scoped workflow skills

- [ ] 2.1 Create `.github/skills/publication-contract/SKILL.md` for modeler-to-work publication changes, covering compatibility headers, envelope validation, idempotency, client authorization, and relevant tests; verify folder/name alignment, keyword-rich discovery description, links to existing publication documentation, and a concrete validation outcome.
- [ ] 2.2 Create `.github/skills/work-vertical-slice/SKILL.md` for validating the published BPMN path from publication through process start, task inbox, completion, and audit history; verify the procedure uses the documented local topology and identifies required service prerequisites and expected outcomes.
- [ ] 2.3 Create `.github/skills/module-validation/SKILL.md` to select narrow Maven, frontend, modeler-build, or browser checks based on touched files; verify every route maps to commands already used by repository CI and includes an explicit stop condition for unavailable prerequisites.

## 3. Validate usefulness and repository compatibility

- [ ] 3.1 Review all new customization files against the existing `.github/skills/openspec-*`, `.github/prompts/opsx-*`, `docs/`, and CI files; verify each file has a distinct trigger, actionable procedure, and observable validation result, and remove any redundant file or section.
- [ ] 3.2 Review repeated statements against the relevant OpenSpec specs; verify specs remain the authority for observable behavior, instructions contain only concise implementation constraints, skills contain procedures and checks, and every repeated high-risk invariant links to its source.
- [ ] 3.3 Validate customization metadata and discoverability by checking each instruction frontmatter block, each `applyTo` pattern, each skill folder/name pair, and each skill description; verify no new customization uses an unnecessarily broad always-loaded pattern or malformed YAML frontmatter.
- [ ] 3.4 Verify the future-maintenance gate by inspecting `openspec instructions proposal --change "add-project-copilot-customizations" --json`; confirm the returned rules require Agent Impact and source-of-truth classification, and verify the OpenSpec instruction file describes the same policy without contradiction.
- [ ] 3.5 Run the repository validation relevant to the documentation-only change: `openspec validate add-project-copilot-customizations`, `./mvnw -B -ntp verify`, `npm test` in both frontend directories, and the modeler frontend build; verify no application source, generated asset, or runtime behavior changed.
- [ ] 3.6 Confirm the final diff contains only the intended `.github` customization files, the OpenSpec configuration rule, and planning artifacts; verify it does not add `.github/agents`, hooks, duplicate reference documentation, or application changes, and remains implementation-ready without a product capability spec.

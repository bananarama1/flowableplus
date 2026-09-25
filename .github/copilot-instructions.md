# FlowablePlus project guidance

- Use Java 17, Spring Boot 4, and Flowable 8 conventions already established by the Maven multi-module build.
- Keep application boundaries explicit: `modeler-app` owns design-time projects, drafts, versions, and publication intent; `work-app` owns publication intake, Flowable execution, tasks, and runtime history. Shared contracts belong in `platform-contracts`; Flowable integration belongs in `platform-flowable`.
- Treat client scope as a security boundary. Protected operations require authentication, authorization, and an explicit client scope; do not expose another client's resources or identifiers.
- Keep database credentials, tokens, and deployment secrets as server-side secrets. Never place them in frontend configuration, publication envelopes, committed files, or chat output.
- OpenSpec artifacts are the planning source of truth. Read the relevant proposal, design, specs, and tasks before implementation, and preserve the dependency order from behavior to design to tasks.
- Source of truth: OpenSpec specs define observable behavior; `docs/` defines repository contracts and operational conventions; `.github/instructions/` defines concise implementation constraints; `.github/skills/` defines repeatable procedures and validation.
- Prefer the existing documentation and CI commands as authoritative references: [developer setup](../docs/developer-setup.md), [publication contract](../docs/publication-contract.md), [runtime API conventions](../docs/runtime-api-conventions.md), and [CI](workflows/ci.yml).
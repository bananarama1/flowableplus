# Flowable Plus implementation rules

- Read `docs/architecture/README.md` and the relevant ADR before changing an architectural boundary.
- Flowable OSS is the underlying platform and the project intentionally tracks it closely.
- Preserve native `flowable.*` properties. Put Flowable Plus properties under `flowableplus.*`.
- Expose native Flowable REST resources under `/flowableplus-api/*`.
- Use native Flowable REST response shapes in the UI unless a documented Plus-specific capability requires another endpoint.
- Keep the initial authentication model as one Spring Security in-memory user mirrored in Flowable IdentityService.
- Do not introduce tenants or external identity providers into the first application slice.
- Use PostgreSQL as the canonical persistence database and classpath deployment for initial process models.
- Keep black-box starter and REST integration tests in `flowableplus-work-integration-tests`.
- Use `flowableplus-work-test-models` for stable test fixtures and `flowableplus-example-models` for runnable example fixtures.
- Use Playwright for browser end-to-end coverage of the complete approval workflow.
- Show authentication, authorization, validation, and task-conflict failures in a top-level UI text banner.
- Do not duplicate native Flowable endpoints without a documented reason.

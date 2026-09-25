---
name: module-validation
description: Use when selecting narrow Maven, frontend, modeler-build, or browser checks for a FlowablePlus change based on touched files. Do not use for designing new behavior, replacing the repository CI commands, or declaring an unavailable environment valid.
license: MIT
compatibility: Uses the Java 17 and Node.js 20 toolchains defined by repository CI.
metadata:
  author: FlowablePlus
---

# Module validation routing

1. Identify the touched paths and the owning boundary. Use the commands in [CI](../../workflows/ci.yml) as the command vocabulary; keep the check narrow when the touched files allow it, then widen only when a shared contract or cross-application path is affected.
2. For Java, Maven, shared contract, Flowable adapter, or backend application changes, run `./mvnw -B -ntp verify`. This is the repository's backend verification gate and covers the multi-module dependency graph.
3. For `modeler-app/frontend/**`, run `npm ci` and `npm test` from `modeler-app/frontend`. If source or bundle behavior changes, also run `npm run build` there and confirm the generated modeler asset is the intended tracked output.
4. For `work-app/frontend/**`, run `npm ci` and `npm test` from `work-app/frontend`. For browser-facing runtime or authenticated shell changes, install Chromium with `npx playwright install --with-deps chromium`, start work-app as CI does, wait for `http://127.0.0.1:8081/health`, and run `npm --prefix work-app/frontend run test:browser`.
5. For a change spanning publication, process start, task completion, or audit history, use the full checks from [publication contract](../publication-contract/SKILL.md) and [work vertical slice](../work-vertical-slice/SKILL.md) after the narrow module checks pass.
6. If Java 17, Node.js 20/npm, Docker Compose, a required dependency install, the work application, or Playwright Chromium is unavailable, stop at that route, report the missing prerequisite and command, and mark validation blocked. Do not substitute another toolchain or infer a pass.

## Validation outcome

Record the touched-path route, exact command, and pass or blocked result. A route is complete only when its existing CI command exits successfully and any required service health check and browser assertion pass.
---
applyTo: "modeler-app/frontend/**/*.js,work-app/frontend/**/*.js"
---

# Modeler and work frontend changes

- Keep frontend code limited to its application contract. The modeler editor edits and serializes BPMN/CMMN; the work frontend consumes published metadata and runtime APIs and does not parse or execute Flowable XML in the browser.
- Never put bearer tokens, database credentials, runtime secrets, or publication credentials in bundled assets, query parameters, committed files, or persistent browser state.
- For modeler editor changes, run `npm test` and rebuild with `npm run build` from `modeler-app/frontend`; the build writes the checked-in static bundle consumed by `modeler-app`.
- For work frontend changes, run `npm test` from `work-app/frontend`. Use `npm run test:browser` only with the work application and Playwright Chromium prerequisites described in [CI](../workflows/ci.yml).
- Preserve the browser baseline: native controls and accessible names, responsive narrow layouts, status announcements, and authenticated runtime flows remain covered by [work frontend baseline](../../docs/work-frontend-baseline.md).
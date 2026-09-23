# Work Frontend Baseline

The first-release work frontend targets evergreen desktop and mobile browsers with JavaScript enabled. The supported baseline is the current and previous major release of Chromium, Firefox, and Safari; Internet Explorer is not supported.

The work shell uses English message and date formatting in the first release. Labels and validation messages are sourced from published form metadata where available, and localization is intentionally deferred until the form-schema contract carries locale data.

The layout is responsive at narrow viewports: navigation can scroll horizontally, content stacks into one column, and task actions remain reachable without horizontal page scrolling. Keyboard navigation uses native links, buttons, labels, form controls, and focusable task rows. Status and validation changes are exposed through `role="status"` or `aria-live` regions, and navigation has an accessible label.

The frontend smoke checks in `work-app/frontend/test/work-shell.test.js` verify the shipped browser baseline and runtime interaction wiring. Full browser automation remains a CI concern and should exercise authenticated catalog, start, task validation, completion, and monitoring flows against a running work app.

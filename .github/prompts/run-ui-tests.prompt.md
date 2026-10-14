---
description: "Run UI tests and summarize failures"
agent: test-engineer
argument-hint: No additional input required.
tools: ['read', 'execute', 'todo']
---

Run the project's Playwright UI tests and report verified results.

1. **Required first step:** run `npm run test:ui:install --workspace=frontend`. Repeat this after a container rebuild. In Ubuntu/Linux this is mandatory; the script runs `playwright install --with-deps chromium` and includes bounded automatic remediation for the common Yarn apt key issue plus one retry.
2. If that install command fails, stop immediately. Do not run Playwright tests. Report an environment blocker with the failing command and key error lines. Do not perform ad-hoc package hunting or broad OS troubleshooting beyond the install script's automated remediation.
3. Ensure the backend and frontend are available before testing. Inspect `packages/frontend/playwright.config.js` first: if its configured `webServer` starts the app with root `npm start`, let Playwright manage that server and avoid starting a duplicate. Otherwise, check whether both services are already running and start them from the repository root with `npm start` if needed. Confirm readiness using observed process, port, or application state; do not rely on arbitrary sleeps.
4. Run the project UI suite with `npm run test:ui` from the repository root. The frontend `pretest:ui` may invoke the installer again; do not bypass configured scripts to hide failures.
5. Summarize the exact command and pass/fail outcome. For failures, classify the likely cause as application code, test code, or environment/infrastructure, cite the relevant error evidence, and give the next discriminating action. State any blocked or unrun checks plainly.

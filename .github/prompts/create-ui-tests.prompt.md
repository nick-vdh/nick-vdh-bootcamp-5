---
description: "Create UI tests for required critical user journeys"
agent: test-engineer
argument-hint: Optional list of user journeys to cover; default journeys are create, edit, toggle, delete, and core error handling.
tools: ['search', 'read', 'edit', 'execute', 'todo']
---

Requested journeys (optional): ${input:journeys}

Create or update Playwright UI tests for the requested critical journeys. If no journeys are supplied, consider create, edit, completion toggle, delete, and core error-state handling.

1. Inspect project instructions, existing UI specs, Playwright configuration, app behavior, and test scripts before editing. Follow `.github/copilot-instructions.md` and `docs/testing-guidelines.md`.
2. Identify the highest-risk journeys and current coverage. Keep this run to **3-5 Playwright test cases total**, with **at least one error-path test**. Never create or materially update more than five test cases in this run. If more than five scenarios are candidates, choose the highest-risk five and list the deferred scenarios.
3. Use the project's Playwright setup. Keep test files focused on scenario intent and outcome assertions. Put reusable selectors and UI interactions in small Page Object classes/helpers; avoid duplicated selectors and flows.
4. Prefer accessible, stable selectors (`getByRole`, `getByLabel`, visible text); use `data-testid` only when semantic locators are unsuitable. Wait for observable state, not fixed delays.
5. Make tests deterministic, isolated, and readable. Use controlled data, reset/create state per test, avoid order dependencies or shared mutable state, and mock/intercept unstable external dependencies when appropriate.
6. Before finishing, inspect the final diff and count the Playwright `test(...)`/`it(...)` cases created or materially updated in this run. Ensure the count is between 3 and 5 inclusive and includes at least one error path. If it exceeds five, reduce the changes and recount. Do not call a result "small scope" if it exceeds the limit.
7. Report changed files, test case count, scenarios covered, deferred scenarios, and any check run. Do not claim tests passed unless they were executed successfully.

---
description: "Execute instructions from the current GitHub Issue step"
agent: tdd-developer
argument-hint: Optional GitHub issue number; leave blank to find the exercise issue.
tools: ['search', 'read', 'edit', 'execute', 'web', 'todo']
---

Issue number (optional; leave blank to discover it): ${input:issue-number}

Use the GitHub CLI workflow documented in `.github/copilot-instructions.md`.

1. If an issue number was supplied, use it. Otherwise run `gh issue list --state open` and identify the issue with `Exercise:` in its title. If the exercise issue is ambiguous, ask the user which issue to use; do not guess.
2. Retrieve the issue and comments with `gh issue view <issue-number> --comments`.
3. Find the latest step instructions in the issue content/comments. Identify its step number and execute each `:keyboard: Activity:` section in the order given. Preserve the step's scope and testing constraints; do not skip or silently reinterpret activities. If no unambiguous current step is present, report that and ask for clarification.
4. Follow the project TDD and testing scope in `.github/copilot-instructions.md`. For new behavior, write and run tests before implementation. For existing test failures, make only the implementation changes needed to pass tests; do not fold in lint cleanup.
5. **Playwright boundary:** Do not create or run Playwright UI tests in this prompt. If the step requires Playwright work, leave that work for `/create-ui-tests` and `/run-ui-tests`; those prompts select the `test-engineer` agent. Do not claim UI coverage is complete until those prompts have run successfully.
6. Do not commit or push. That work belongs to `/commit-and-push`.
7. Stop after completing the step activities and summarize changes, checks and outcomes, and the step number. Give the next commands in exactly this order:
   - If UI workflow is required: `/create-ui-tests` → `/run-ui-tests` → `/validate-step <step-number>`.
   - If UI workflow is not required: `/validate-step <step-number>`.
   Never recommend `/validate-step` before required UI prompts. Do not start validation or commit/push from this prompt.

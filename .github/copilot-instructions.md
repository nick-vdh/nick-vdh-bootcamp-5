---
description: "Workspace guidance for the TODO application and its development workflows"
---

## Project Context
- This is a full-stack TODO application with a React frontend and an Express backend, organized as an npm-workspaces monorepo.
- Development is iterative and feedback-driven: use tests, lint output, and runtime behavior to guide small changes.
- Current phase: backend stabilization and frontend feature completion.

## Documentation References
- [Project overview](../docs/project-overview.md): architecture, technology stack, and repository structure.
- [Testing guidelines](../docs/testing-guidelines.md): test patterns, scope boundaries, and standards.
- [Workflow patterns](../docs/workflow-patterns.md): development workflow guidance.

## Development Principles
- **Test-Driven Development:** Follow the Red-Green-Refactor cycle: write or run a test that fails, implement the smallest change that passes, then refactor while keeping tests green.
- **Incremental Changes:** Make small, testable modifications and validate each step before moving on.
- **Systematic Debugging:** Treat test failures and tool output as evidence; identify the failing behavior, make a focused fix, and rerun the relevant check.
- **Validation Before Commit:** Ensure all applicable tests pass and there are no lint errors before committing.

## Testing Scope
This project uses unit tests, integration tests, and UI end-to-end tests:
- **Backend:** Jest and Supertest for API and integration testing.
- **Frontend:** React Testing Library for component unit and integration tests.
- **UI testing:** Playwright for automating critical user journeys.
- **Manual browser testing:** Exploratory validation and visual checks.
- **Why this combination:** Unit and integration tests provide fast feedback; end-to-end and manual checks build confidence in complete user workflows and the rendered experience.

### Testing Approach by Context
- **Backend API changes:** Write Jest tests first, then implement using Red-Green-Refactor.
- **Frontend component features:** Write React Testing Library tests first for component behavior, then implement using Red-Green-Refactor. Follow with manual browser testing for full UI flows.
- This is true TDD: write the test before the production code, observe the failure, then implement to pass it.
- Keep UI test authoring and execution within the test-engineer's ownership described below. The tdd-developer should not create or run Playwright UI tests.

## Workflow Patterns
1. **TDD Workflow:** Write or fix tests → run and observe failure → implement → verify pass → refactor.
2. **Code Quality Workflow:** Run lint → categorize issues → fix systematically → re-validate.
3. **Integration Workflow:** Identify issue → debug → test → fix → verify end-to-end.
4. **UI Testing Workflow:** Define critical journeys → create UI tests → run → debug failures → validate coverage.

## Agent Usage
- **tdd-developer:** Use for implementation and unit/integration TDD cycles. Do not create or run Playwright UI tests in this mode.
- **code-reviewer:** Use to address lint errors and improve code quality.
- **test-engineer:** Owns all Playwright UI test authoring and execution, failure triage, and test-isolation checks.

## Memory System
- **Persistent Memory:** This file (`.github/copilot-instructions.md`) contains foundational principles and workflows.
- **Working Memory:** `.github/memory/` contains development discoveries and recurring patterns; see its [README](memory/README.md) for how to use the system.
- During active development, take notes in `.github/memory/scratch/working-notes.md` (not committed).
- At the end of a session, summarize key findings in `.github/memory/session-notes.md` (committed).
- Document recurring code patterns in `.github/memory/patterns-discovered.md` (committed).
- Reference these files when providing context-aware suggestions.

## Workflow Utilities
GitHub CLI is available in all modes for issue-driven workflow automation:
- List open issues: `gh issue list --state open`
- Get issue details: `gh issue view <issue-number>`
- Get an issue and its comments: `gh issue view <issue-number> --comments`
- The main exercise issue has `Exercise:` in its title; exercise steps are posted as comments on that issue.
- Use these commands when `/execute-step` or `/validate-step` prompts are invoked.

## Git Workflow
- Use conventional commit messages, such as `feat:`, `fix:`, `chore:`, and `docs:`.
- Create feature branches using `feature/<descriptive-name>`.
- Stage all changes before committing with `git add .`.
- Push to the correct branch with `git push origin <branch-name>`.

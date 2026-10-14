---
description: "Analyze changes, generate commit message, and push to feature branch"
argument-hint: Required target branch name; do not proceed without it.
tools: ['read', 'execute', 'todo']
---

Target branch name (required): ${input:branch-name}

Use the Git workflow in `.github/copilot-instructions.md`. The branch name must be explicitly supplied. If it is missing or blank, ask the user for it and stop without changing Git state. Never commit or push to `main` or any branch other than the exact user-provided branch.

1. Inspect `git status --short`, `git diff`, and `git diff --cached`; review untracked files as well. Summarize what would be committed and generate a descriptive Conventional Commit message (`feat:`, `fix:`, `chore:`, `docs:`, etc.) based on the actual changes. Do not include unrelated or secret files; if the working tree contains changes that should not be included, stop and ask before staging.
2. Determine whether the current exercise step requires UI workflow from the current chat context or the Exercise issue and its comments using `gh` CLI as documented in project instructions. If UI workflow is required, do not commit until either `/run-ui-tests` has completed successfully in this chat or `npm run test:ui` succeeds now. If neither is true, run the UI workflow before proceeding. A failed or blocked UI run means stop without committing or pushing.
3. Reject `main` (including `origin/main`) as the target. Check whether the specified local branch exists. If it exists, switch with `git checkout <branch-name>`; otherwise create it with `git checkout -b <branch-name>`. If checkout fails, stop and report the failure; do not stash, discard, or force changes. Confirm `git branch --show-current` exactly matches the supplied branch before continuing.
4. Recheck the diff and status after switching branches. Stage all intended changes with `git add .`, inspect the staged diff, and ensure it contains only the changes the user approved. If it contains anything else, stop and ask rather than commit.
5. Commit using the generated Conventional Commit message, then push only to the supplied branch with `git push origin <branch-name>`.
6. Report the branch, commit hash/message, push result, and relevant UI test evidence. Never claim a commit or push succeeded unless the command confirms it.

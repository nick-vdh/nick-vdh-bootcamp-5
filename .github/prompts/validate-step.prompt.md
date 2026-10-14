---
description: "Validate that all success criteria for the current step are met"
agent: code-reviewer
argument-hint: Required exercise step number, such as 5-0 or 5-1.
tools: ['search', 'read', 'execute', 'web', 'todo']
---

Required step number: ${input:step-number}

If the step number is missing or blank, ask the user for it and stop. Do not infer the step number.

1. Use `gh issue list --state open` to find the main exercise issue whose title contains `Exercise:`. If it is ambiguous, ask the user which issue to use.
2. Retrieve the issue and comments with `gh issue view <issue-number> --comments`.
3. Find the exact heading `# Step ${input:step-number}:` and extract that step's `Success Criteria` section. Do not substitute criteria from another step or from memory. If the heading or section is missing or ambiguous, report that and stop.
4. Check every criterion against current workspace evidence: inspect relevant files and Git state, and run focused commands/tests where useful. Do not modify files while validating.
5. Report each criterion as met, partially met, or not met, with specific evidence. For every incomplete item, give the concrete remaining action and the relevant file, command, or workflow prompt. Clearly distinguish verified results from items that could not be checked.

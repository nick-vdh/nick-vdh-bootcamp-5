# Development Memory System

This directory captures discoveries made while developing the TODO application so that useful context survives beyond the current task. Record verified patterns, decisions, and lessons instead of relying on chat history or rediscovering the same details later.

## Two Types of Memory

- **Persistent memory** lives in [`.github/copilot-instructions.md`](../copilot-instructions.md). It contains foundational project principles, workflows, and agent responsibilities that should guide work across sessions.
- **Working memory** lives in this directory. It contains project-specific findings gathered during development, completed-session summaries, and reusable code patterns.

Persistent instructions describe how development should generally happen. Working memory records what the team has learned while applying those practices to this codebase.

## Directory Structure

```text
.github/memory/
|-- README.md                  # This guide
|-- session-notes.md            # Completed session summaries; committed
|-- patterns-discovered.md     # Reusable code patterns; committed
\-- scratch/
    |-- .gitignore              # Keeps scratch contents out of git
    \-- working-notes.md        # Active session notes; not committed
```

`session-notes.md` is a historical record: write a concise summary there after a session is complete, and commit it. `scratch/working-notes.md` is a temporary workspace for the current task. It is intentionally ignored and should not be committed. The scratch template is present in the workspace as a starting point; because the directory ignores all files other than its `.gitignore`, Git will not track it. The `.gitignore` exception lets the ignore rule itself be committed.

## When to Use Each File

### During TDD

Use `scratch/working-notes.md` to capture the behavior under test, relevant failing test output, hypotheses, and decisions while moving through red, green, and refactor. Record a confirmed reusable testing or implementation convention in `patterns-discovered.md`. At the end of the session, summarize the outcome and important decisions in `session-notes.md`.

### During linting or compilation work

Use the scratch notes to track the error categories being addressed, the root cause, and the checks rerun after each fix. If the investigation reveals a recurring project convention or a useful fix pattern, add it to `patterns-discovered.md`. Put the completed work and lasting conclusions in `session-notes.md`.

### During debugging

Use the scratch notes to record the reproduction, evidence, hypothesis, experiments, blockers, and next steps. Once the cause is confirmed, promote reusable lessons to `patterns-discovered.md`; record a brief account of the completed investigation in `session-notes.md`.

Do not promote every temporary observation. Keep session summaries focused on outcomes and decisions, and keep patterns focused on guidance that will help with future code changes.

## How AI Uses These Notes

At the start of relevant work, an AI assistant should read the persistent instructions and consult the memory files that apply to the task. It should use completed session summaries as historical context and patterns as reusable guidance, then apply them only when relevant to the current code. During active work, it can update the ignored scratch notes; after the work is complete, it should distill verified and reusable findings into the committed files. Notes are context, not a substitute for checking the current implementation, tests, and tool output.

## Keeping Memory Useful

1. Capture concise notes as work progresses in `scratch/working-notes.md`.
2. Verify discoveries against code, tests, or runtime behavior before treating them as facts.
3. At session end, add a completed summary to `session-notes.md` and promote recurring lessons to `patterns-discovered.md`.
4. Leave active scratch notes uncommitted. The `scratch/.gitignore` rule ignores all files under that directory except the `.gitignore` file itself.
5. Keep persistent instructions reserved for stable, broadly applicable project guidance; avoid duplicating them in session notes.

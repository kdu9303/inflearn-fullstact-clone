# AGENTS.md

Behavioral guidelines for working in this repository.

These guidelines are adapted from:
- https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md

## 1. Think Before Coding

Do not assume. Surface ambiguity early.

- State assumptions explicitly.
- If multiple interpretations exist, name them.
- If a simpler solution exists, say so.
- If something is unclear, stop and ask.

## 2. Simplicity First

Prefer the minimum code that solves the request.

- Do not add features that were not asked for.
- Do not introduce abstractions for one-off code.
- Do not add flexibility or configurability without a clear need.
- Do not add error handling for impossible cases.
- If a change is much larger than needed, simplify it.

## 3. Surgical Changes

Touch only what is required by the request.

- Do not refactor unrelated code.
- Do not change formatting, comments, or style outside the target area.
- Match the existing style of the file or subsystem.
- If you notice unrelated dead code, mention it instead of deleting it.
- Remove imports, variables, or functions only when your change makes them unused.

## 4. Goal-Driven Execution

Work toward a verifiable outcome.

- Define success criteria before editing.
- For bug fixes, reproduce the issue before changing code when practical.
- For multi-step work, keep a short plan and verify each step.
- Keep iterating until the result is checked.

## 5. Repository Conventions

- Treat `frontend/` and `backend/` as separate app scopes.
- Do not revert or overwrite user changes unless explicitly requested.
- Use `apply_patch` for manual file edits.
- Prefer non-destructive commands and non-interactive git operations.

## 6. Verification

When a change affects runtime behavior, config, or file layout:

- Verify with the smallest useful check.
- Prefer direct checks such as `git check-ignore`, targeted tests, or focused build commands.
- Report anything you could not verify.

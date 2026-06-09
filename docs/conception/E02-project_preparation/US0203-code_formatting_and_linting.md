# Code Formatting & Linting — Conception

> Implementation: [US0203-code_formatting_and_linting-imp.md](../../implementation/E02-project_preparation/US0203-code_formatting_and_linting-imp.md)

## Why we need it

Code style and quality must stay **consistent across everyone** (humans and the
agent) without relying on manual discipline. Issues should be caught **before
they enter the repo**, not in review.

## How it should work

- **Prettier** owns formatting (whitespace, quotes, semicolons).
- **ESLint** owns code quality (unused vars, hook deps, accessibility).
- A **pre-commit hook** runs these automatically on every commit, so bad code
  can't be committed.

## What should be done (rules)

- **Tooling enforces it, not people:** formatter + linter + a Git pre-commit hook.
- **Check staged files only** on commit, for speed.
- **Fail the commit** if any staged file fails formatting or linting.
- **Provide manual scripts** (format, lint, fix) so issues can be resolved before
  committing.
- The agent should still follow the conventions up front to avoid friction.

## Technical Stories

| ID       | Technical Story        | What to do                                                                                                                                             | Status |
| -------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| TS020301 | Prettier setup         | Add Prettier with the project's formatting rules (`.prettierrc`) and `format` / `format:check` scripts.                                                | Done   |
| TS020302 | ESLint setup           | Configure ESLint (flat config) with TypeScript, React, React-Hooks and jsx-a11y plugins, plus per-file-type overrides and `lint` / `lint:fix` scripts. | Done   |
| TS020303 | Pre-commit enforcement | Wire Husky + lint-staged so ESLint and Prettier run on staged files on every commit and abort it on failure.                                           | Done   |

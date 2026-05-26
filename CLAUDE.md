# Project Instructions

## Package Management

- **Never install packages without explicit validation** — ask the user to confirm each `npm install` command before running it
- Always explain why each package is needed before installing

## Code Quality

- Run `npm run lint` and `npm run format` before committing to ensure code passes linting and formatting checks
- **Never run `npm run format` without explicit validation** — format changes files, confirm with user first

## Git

- Never use `git push origin --delete` — delete remote branches manually via GitHub UI or ask user
- The `develop` branch is protected — all changes must go through PRs

## Issue Resolution Workflow

When an issue is detected and a solution is found/applied:

1. User asks: **"generate a TS (for tech story) or US (for user story)"**
2. Provide the following for validation:
    - **Short description:** One-line summary of what we handle
    - **Description:** Why and What we need and how to do it
    - **Branch:** `TS-xxx/short_description` or `US-xxx/short_description` (ticket number provided by user)
3. If validated → create branch from last commit on `develop` with the validated name
4. Do the work, commit with separated concerns (e.g., config in one commit, format in another)
5. **Validate before committing** — show what will be committed and get confirmation

## Commit Messages

- Keep commit titles short (under 72 characters)
- Prefix with the ticket number when applicable (e.g., `TS-012: Add ESLint configuration`)

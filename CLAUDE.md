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

## Commit Messages

- Keep commit titles short (under 72 characters)
- Prefix with the ticket number when applicable (e.g., `TS-012: Add ESLint configuration`)

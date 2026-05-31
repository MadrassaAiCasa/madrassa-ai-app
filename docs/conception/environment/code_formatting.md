# Code Formatting

## Short Description

ESLint + Prettier + Husky pre-commit hook enforce consistent code style across the project.

## Description

The project uses **Prettier** for code formatting and **ESLint** for linting. A **Husky** pre-commit hook runs **lint-staged** to ensure all staged files pass ESLint and Prettier checks before any commit.

## Tools

| Tool        | Role                      |
| ----------- | ------------------------- |
| Prettier    | Code formatting (style)   |
| ESLint      | Code linting (patterns)   |
| Husky       | Git hooks                 |
| lint-staged | Run tools on staged files |

## Prettier Rules

Configuration in `.prettierrc`:

| Rule            | Value   | Effect                               |
| --------------- | ------- | ------------------------------------ |
| `singleQuote`   | `true`  | Use single quotes `'` instead of `"` |
| `semi`          | `true`  | Semicolons at end of statements      |
| `tabWidth`      | `4`     | Indentation width of 4 spaces        |
| `printWidth`    | `100`   | Max line length before wrapping      |
| `trailingComma` | `"es5"` | Trailing commas where valid in ES5   |

## ESLint Configuration

Configuration in `eslint.config.js`. Uses **flat config** (ESLint 9).

### Plugins

- `@typescript-eslint` — TypeScript support
- `react` — React rules
- `react-hooks` — React Hooks rules (exhaustive-deps, etc.)
- `jsx-a11y` — Accessibility rules

### Config Per File Type

| Files                | Parser      | Extra globals                                                                                     |
| -------------------- | ----------- | ------------------------------------------------------------------------------------------------- |
| `**/*.jsx`           | Built-in JS | `browser`, `node`                                                                                 |
| `**/*.tsx`           | TypeScript  | `browser`, `node`                                                                                 |
| `**/*.test.{ts,tsx}` | TypeScript  | `browser`, `node`, `jest`, `describe`, `it`, `expect`, `beforeAll`, `afterEach`, `afterAll`, `vi` |

### Notable Rules

- `react/react-in-jsx-scope: off` — No need to import React in every JSX file (React 17+)
- All recommended rules from TypeScript-ESLint, React, React-Hooks, and JSX-A11y are enabled

## Git Hooks

### Pre-commit (Husky)

```
npx lint-staged
```

Runs automatically on every `git commit`. Fails the commit if any staged file fails checks.

### What lint-staged Runs

```json
{
    "*.{js,jsx,ts,tsx}": ["eslint"],
    "*.{js,jsx,ts,tsx,css,html,json,md}": ["prettier --check"]
}
```

- **ESLint** on staged JS/TS files (fixes auto-fixable issues)
- **Prettier check** on staged JS/TS/CSS/HTML/JSON/MD files (no fix, just check)

## NPM Scripts

| Script                 | Command                                      |
| ---------------------- | -------------------------------------------- |
| `npm run format`       | `prettier --write .` — format all files      |
| `npm run format:check` | `prettier --check .` — check without writing |
| `npm run lint`         | `eslint src --ext ts,tsx,js,jsx`             |
| `npm run lint:fix`     | `eslint src --ext ts,tsx,js,jsx --fix`       |
| `npm run test`         | `vitest run --run` — run tests once          |
| `npm run test:watch`   | `vitest` — watch mode                        |

## Workflow

1. **Before commit** — Husky pre-commit hook runs lint-staged automatically
2. **Manual format** — `npm run format` to format all files
3. **Manual lint** — `npm run lint` to check for errors
4. **Fix auto-fixable** — `npm run lint:fix` then re-format if needed

## Pre-commit Flow

```
git commit
    → Husky pre-commit hook
        → lint-staged
            → ESLint on staged .js/.jsx/.ts/.tsx
            → Prettier --check on staged .js/.jsx/.ts/.tsx/.css/.html/.json/.md
        → if any fail → commit aborted
    → if all pass → commit proceeds
```

## Notes

- Prettier handles **formatting** (whitespace, quotes, semicolons)
- ESLint handles **code quality** (unused vars, exhaustive-deps, accessibility)
- Husky ensures checks run **every time**, even for developers who skip manual checks
- lint-staged only checks **staged files** — fast, no need to check the whole repo
- ESLint does **not** auto-fix — use `lint:fix` first, then `format` for remaining issues

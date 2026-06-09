# Code Formatting & Linting — Implementation

> Conception: [US0203-code_formatting_and_linting.md](../../conception/E02-project_preparation/US0203-code_formatting_and_linting.md)
>
> How formatting & linting were actually set up, organized by Technical Story.

## Tools

| Tool        | Role                      |
| ----------- | ------------------------- |
| Prettier    | Code formatting (style)   |
| ESLint      | Code linting (patterns)   |
| Husky       | Git hooks                 |
| lint-staged | Run tools on staged files |

---

## TS020301 — Prettier setup

Configuration in `.prettierrc`:

| Rule            | Value   | Effect                               |
| --------------- | ------- | ------------------------------------ |
| `singleQuote`   | `true`  | Use single quotes `'` instead of `"` |
| `semi`          | `true`  | Semicolons at end of statements      |
| `tabWidth`      | `4`     | Indentation width of 4 spaces        |
| `printWidth`    | `100`   | Max line length before wrapping      |
| `trailingComma` | `"es5"` | Trailing commas where valid in ES5   |

Scripts: `npm run format` (`prettier --write .`) and `npm run format:check`
(`prettier --check .`).

---

## TS020302 — ESLint setup

Configuration in `eslint.config.js` using **flat config** (ESLint 9).

**Plugins**

- `@typescript-eslint` — TypeScript support
- `react` — React rules
- `react-hooks` — React Hooks rules (exhaustive-deps, etc.)
- `jsx-a11y` — Accessibility rules

**Config per file type**

| Files                | Parser      | Extra globals                                                                                     |
| -------------------- | ----------- | ------------------------------------------------------------------------------------------------- |
| `**/*.jsx`           | Built-in JS | `browser`, `node`                                                                                 |
| `**/*.tsx`           | TypeScript  | `browser`, `node`                                                                                 |
| `**/*.test.{ts,tsx}` | TypeScript  | `browser`, `node`, `jest`, `describe`, `it`, `expect`, `beforeAll`, `afterEach`, `afterAll`, `vi` |

**Notable rules**

- `react/react-in-jsx-scope: off` — no need to import React in every JSX file (React 17+).
- All recommended rules from TypeScript-ESLint, React, React-Hooks and jsx-a11y enabled.

Scripts: `npm run lint` (`eslint src --ext ts,tsx,js,jsx`) and `npm run lint:fix` (`--fix`).

---

## TS020303 — Pre-commit enforcement

Husky pre-commit hook runs lint-staged:

```
npx lint-staged
```

`lint-staged` config (in `package.json`):

```json
{
    "*.{js,jsx,ts,tsx}": ["eslint"],
    "*.{js,jsx,ts,tsx,css,html,json,md}": ["prettier --check"]
}
```

**Pre-commit flow**

```
git commit
    → Husky pre-commit hook
        → lint-staged
            → ESLint on staged .js/.jsx/.ts/.tsx
            → Prettier --check on staged .js/.jsx/.ts/.tsx/.css/.html/.json/.md
        → if any fail → commit aborted
    → if all pass → commit proceeds
```

---

## Notes

- Prettier handles **formatting**; ESLint handles **code quality**.
- Husky ensures checks run **every time**, even if a dev skips manual checks.
- lint-staged checks **staged files only** — fast, no full-repo scan.
- ESLint in lint-staged does not auto-fix here — use `lint:fix` then `format`
  to resolve remaining issues before committing.

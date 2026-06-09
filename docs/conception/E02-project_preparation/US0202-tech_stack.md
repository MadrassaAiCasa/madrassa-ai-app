# US0202 — Tech Stack — Conception

> Reference doc: the libraries the project is built on and **why** each was chosen.
> This is an adoption/decision record — there is no separate implementation file.

## User story

- **As a** developer (or agent) joining the project,
- **I need** a clear list of the stack and the reason behind each choice,
- **so that** I build with the right tools and don't introduce redundant ones.

## Why we need it

- Keep the stack **consistent** — everyone reaches for the same library for the same job.
- Avoid **duplication** (e.g. two state or HTTP libraries).
- Make **onboarding** fast and **upgrades** deliberate.

## The stack

### Language & build

- **TypeScript** — typed JS; catches errors early, better DX.
- **Vite** — fast dev server + build (`@vitejs/plugin-react`).

### UI

- **React 18** — component UI library.
- **MUI (`@mui/material`)** — ready-made, accessible component system.
- **Emotion (`@emotion/react`, `@emotion/styled`)** — styling engine MUI uses.

### State

- **Redux Toolkit (`@reduxjs/toolkit`)** — predictable global state (auth, etc.).
- **React-Redux** — React bindings for the store.

### Data / networking

- **axios** — HTTP client (interceptors for auth/refresh).

### Routing

- **react-router-dom v7** — client-side routing, guards, navigation.

### Testing

- **Vitest** — test runner (Vite-native).
- **@testing-library/react** + **jest-dom** — component testing.
- **jsdom** — DOM environment for tests.
- **MSW** — network-level mock backend (see [US0204](./US0204-mock_backend_msw.md)).

### Code quality

- **ESLint** (flat config) + **Prettier** + **Husky** + **lint-staged**
  — see [US0203](./US0203-code_formatting_and_linting.md).

## What should be done (rules)

- **One library per job** — don't add a second state/HTTP/routing/styling lib.
- **New dependencies are a decision** — justify the need and add it here.
- **Prefer the stack's idioms** (RTK slices, MUI `sx`, RTL queries) over ad-hoc patterns.
- **Pin via the lockfile**; upgrade major versions deliberately, not incidentally.

## Technical Stories

_None — this User Story is documentation only (the stack is adopted, not built).
Versions are tracked in `package.json`._

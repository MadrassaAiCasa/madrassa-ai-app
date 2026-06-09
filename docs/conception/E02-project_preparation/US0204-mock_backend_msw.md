# Mock Backend (MSW) — Conception

> Implementation: [US0204-mock_backend_msw-imp.md](../../implementation/E02-project_preparation/US0204-mock_backend_msw-imp.md)

## Why we need it

The frontend must be developed and tested **before the real backend exists**.
MSW (Mock Service Worker) intercepts API calls at the network layer, so the app
talks to realistic fake endpoints without changing app code.

## How it should work

- **Browser (dev):** a service worker intercepts `fetch` / `axios` / `XMLHttpRequest`.
- **Node (tests):** `msw/node` intercepts HTTP calls.
- The **same handler definitions** must work in both environments.

## What should be done (rules)

- **Common setup once:** shared files set up MSW for both browser and tests.
- **Per-feature handlers:** each feature owns a `handlers/<feature>/` folder with
  **one file per endpoint**, so mocks are easy to find, add, and delete.
- **Per-feature mock store:** each feature has its own in-memory store modeling
  the server's state, covering all use cases so the frontend can be tested fully
  without a real backend. Tests **reset the store** between cases for isolation.
- **Toggle in dev:** mocks are switched on via the `VITE_USE_MOCKS` env var;
  **tests always use mocks**.
- **Adding a feature mock:** create its handlers folder, merge its handlers, and
  register them in the shared server and browser setup.

## Technical Stories

> This is the **generic** MSW base, reusable by any project. Feature-specific
> handlers (e.g. auth) live with their feature — see
> [E03 / US0301 / TS030107](../E03-authentication/US0301-login_and_session.md).

| ID       | Technical Story  | What to do                                                                                                                                           | Status |
| -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| TS020401 | Common MSW setup | Node server (`msw/node`) + browser worker, a shared entry that merges all feature handlers, and the `VITE_USE_MOCKS` dev toggle wired in `main.tsx`. | Done   |
| TS020402 | Test wiring      | Test setup file that starts the server and resets handlers (and any per-feature stores) between tests, registered via Vitest `setupFiles`.           | Done   |

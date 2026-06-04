# US0301 — Login & Session — Conception

> Implementation: [US0301-login_and_session-imp.md](../../implementation/E03-authentication/US0301-login_and_session-imp.md)

## User story

- **As a** staff user (Superadmin / Admin / Teacher),
- **I need to** log in with my username or email + password and stay signed in securely,
- **so that** I can use the app and it remembers me until I log out or my session expires.

## Description

- Cover the **full session lifecycle** on the frontend: login → stay signed in → silent refresh → logout.
- **Login:** username **or** email + password; show errors and a loading state.
- **Session restore:** on app load, check the existing session and sign the user back in.
- **Silent refresh:** when the access token expires, get a new one without bothering the user.
- **Logout:** clear the session and return to the login page.
- **Route protection:** keep app pages behind auth; keep `/login` away from already-signed-in users.

## Why

- Users shouldn’t have to **log in again on every reload** — sessions must persist.
- An expiring access token shouldn’t **interrupt** the user — refresh must be silent.
- Unauthenticated users must **never see protected pages**.

## How it should work

- **Access token** kept in memory; **refresh token** in an httpOnly cookie, rotated on refresh.
- On app load, call **`GET /auth/session`**; if valid, restore the user into state.
- On a `401`, the API layer calls **`POST /auth/refresh`** once and retries the request.
- **Logout** calls `POST /auth/logout` and clears local auth state.
- Endpoints: `POST /auth/login`, `GET /auth/session`, `POST /auth/refresh`, `POST /auth/logout`.

## What should be done (rules)

- **Logic in hooks, UI in components** — the form is presentation only; auth logic lives in a hook.
- **Central auth state** (Redux) is the single source of truth for `user` / `isAuthenticated` / `isLoading`.
- **Two route guards:** one for protected pages, one for public-only pages (`/login`).
- **Gate first render** until the session check has run, so protected pages don’t flash.
- **Reject any “session” response without a real `user`** — a stray HTML response must not authenticate.

## Technical Stories

| ID       | Technical Story            | What to do                                                                                                                                                               | Status |
| -------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| TS030101 | Auth Redux slice           | Auth state (`user`, `tokens`, `isAuthenticated`, `isLoading`) + reducers (`setCredentials`, `clearCredentials`, `setLoading`).                                           | Done   |
| TS030102 | Auth API service           | Shared axios client (`withCredentials`, bearer header) + endpoints (login, getSession, refresh, logout) + auto-refresh-on-401 interceptor with concurrent-refresh dedup. | Done   |
| TS030103 | useAuth hook               | Typed hook exposing `user`, `isAuthenticated`, `isLoading`, `login`, `logout`, `restoreSession`.                                                                         | Done   |
| TS030104 | Route guards               | `ProtectedRoute` (redirect to `/login` when logged out) + `PublicRoute` (redirect to `/dashboard` when logged in), spinner while checking.                               | Done   |
| TS030105 | LoginForm UI               | MUI form (username/email + password), error alert, loading state, redirect to `/dashboard` on success. Presentation only.                                                | Done   |
| TS030106 | App auth wiring            | Providers (Redux, MUI, Router), routes + guards, Dashboard, session restore on load, and a gate that waits for the mock worker before first render.                      | Done   |
| TS030107 | Auth mock handlers + store | `handlers/auth/` with one file per endpoint (login, session, refresh, logout) and an in-memory `mockStore` modeling auth state, plus its test-time reset.                | Done   |

> The generic MSW infrastructure (browser/node setup, test wiring) is the reusable
> base in E02 — [US0204](../E02-project_preparation/US0204-mock_backend_msw.md).
> These **auth-specific** handlers (TS030107) belong to this feature.

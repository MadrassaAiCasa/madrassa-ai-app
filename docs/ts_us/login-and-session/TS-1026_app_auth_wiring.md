# TS-1026: App Auth Wiring

`App.tsx` wiring of all auth providers, routes, route guards, and session restore.

## Description

Wires together MUI `ThemeProvider`, Redux `Provider`, React Router, the route
guards (`ProtectedRoute` / `PublicRoute`), the `Dashboard`, and session restore on
app load. Also gates the first render on MSW being ready so requests never leak to
the network before the mock worker is active.

## File Structure

```
src/
├── App.tsx                          # Providers, routes, MSW-ready gate
├── components/
│   ├── auth/
│   │   ├── ProtectedRoute.tsx       # guards authenticated routes (TS-1023)
│   │   ├── PublicRoute.tsx          # guards public-only routes (e.g. /login)
│   │   └── LoginForm.tsx            # (TS-1024)
│   └── dashboard/
│       └── Dashboard.tsx            # authenticated landing + logout button
└── mocks/setUp.ts                   # enableMocking() — starts MSW worker
```

## Providers (outside-in)

1. **Provider** (Redux) — provides the auth store
2. **ThemeProvider** (MUI) — provides the Material UI theme
3. **BrowserRouter** (React Router) — provides routing context

## Routes

| Path         | Element                        | Guard                                  |
| ------------ | ------------------------------ | -------------------------------------- |
| `/login`     | `PublicRoute` → `LoginForm`    | Redirects to `/dashboard` if logged in |
| `/dashboard` | `ProtectedRoute` → `Dashboard` | Redirects to `/login` if logged out    |
| `/`          | `Navigate` → `/dashboard`      | — (then `/dashboard` guard applies)    |

### PublicRoute

Mirror of `ProtectedRoute`: shows a spinner while `isLoading`, then redirects an
**authenticated** user to `/dashboard`. Keeps `/login` unreachable once logged in.

### Dashboard

Authenticated landing page. Renders a welcome (`user.username`) and a **Logout**
button that calls `logout()` then `navigate('/login', { replace: true })`.

## MSW-Ready Gate

`App` renders `null` until `enableMocking()` resolves, then flips `isReady`. This
guarantees the mock service worker is intercepting before `AppContent` mounts and
fires `GET /auth/session`. See the race-condition note in
[TS-1020_msw_setup.md](./TS-1020_msw_setup.md#notes).

## Session Restore

On mount, `AppContent` calls `restoreSession()` (from `useAuth`) inside `useEffect`.
It calls `GET /auth/session`; on success it dispatches `setCredentials`. The hook
**rejects any response without a `user` field**, so a stray HTML response (e.g. the
dev-server fallback) can never be mistaken for a valid session.

## Dependencies

- `@mui/material`, `@emotion/react`, `@emotion/styled` — UI + styling
- `react-redux` — Redux bindings
- `react-router-dom` — routing (`useNavigate`, `Navigate`, guards)

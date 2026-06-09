# US0301 — Login & Session — Implementation

> Conception: [US0301-login_and_session.md](../../conception/E03-authentication/US0301-login_and_session.md)
>
> How Login & Session was actually built, organized by Technical Story.
> Code lives under the feature-based `src/features/auth/` plus shared `routes/`, `pages/`, `store/`.

## File map (overview)

```
src/
├── features/auth/
│   ├── api/        → client.ts, authApi.ts, types.ts, index.ts   (TS030102)
│   ├── store/      → authSlice.ts                                (TS030101)
│   ├── hooks/      → useAuth.ts                                  (TS030103)
│   ├── components/ → LoginForm/                                  (TS030105)
│   └── index.ts    → feature public exports
├── routes/         → ProtectedRoute.tsx, PublicRoute.tsx, index.tsx, paths.ts  (TS030104, TS030106)
├── pages/          → LoginPage.tsx, DashboardPage.tsx            (TS030106)
├── store/index.ts  → root store                                 (TS030101)
├── shared/hooks/   → typed redux hooks (useAppDispatch/Selector) (TS030101)
├── mocks/handlers/auth/ → login/session/refresh/logout + mockStore (TS030107)
└── App.tsx         → providers + MSW-ready gate + session restore (TS030106)
```

---

## TS030101 — Auth Redux slice

- `src/features/auth/store/authSlice.ts` + root store in `src/store/index.ts`.
- State: `user`, `tokens { accessToken, expiresAt }`, `isAuthenticated`, `isLoading`.
- Reducers: `setCredentials({ user, tokens })`, `clearCredentials()`, `setLoading(boolean)`.
- Typed hooks `useAppDispatch` / `useAppSelector` live in `src/shared/hooks/redux.ts`.
- Tested in `src/test/authSlice.test.ts`.

## TS030102 — Auth API service

- `src/features/auth/api/` — `client.ts` (shared axios factory), `authApi.ts`, `types.ts`.
- `createApiClient(baseUrl)` sets `withCredentials: true`, adds `Authorization: Bearer <token>`.
- Access token kept in memory via `setAccessToken()` / `getAccessToken()`.
- **Auto-refresh interceptor:** on `401` (guarded by `_retry`), calls `POST /auth/refresh`,
  retries the original request, and **dedupes concurrent refreshes** via a `refreshPromise` singleton.
- **Base URL switch:** `VITE_API_BASE_URL` empty → relative URLs (MSW intercepts);
  set it (+ `VITE_USE_MOCKS=false`) to hit the real server `../madrassa-ai-server`.
- Tested in `src/test/authApi.test.ts`.

## TS030103 — useAuth hook

- `src/features/auth/hooks/useAuth.ts`.
- Exposes `user`, `isAuthenticated`, `isLoading`, `login`, `logout`, `restoreSession`.
- `restoreSession()` **rejects any response without a `user` field** (guards against stray HTML).
- Tested in `src/test/useAuth.test.tsx`.

## TS030104 — Route guards

- `src/routes/ProtectedRoute.tsx`, `src/routes/PublicRoute.tsx`, paths in `src/routes/paths.ts`.
- `ProtectedRoute`: spinner while `isLoading` → redirect to `/login` if logged out → else render.
- `PublicRoute`: mirror — redirects an authenticated user to `/dashboard` (keeps `/login` unreachable).
- Tested in `src/test/protectedRoute.test.tsx`.

## TS030105 — LoginForm UI

- `src/features/auth/components/LoginForm/`.
- MUI `Box`(form) / `TextField` / `Button` / `Alert` / `CircularProgress`; styling via `sx`.
- Username-or-email + password; error `Alert` (`role="alert"`); inputs/button disabled while loading.
- On success: `navigate('/dashboard', { replace: true })`. Presentation only — calls `useAuth`.
- Tested in `src/test/loginForm.test.tsx`.

## TS030106 — App auth wiring

- `src/App.tsx`, routes in `src/routes/index.tsx`, pages `src/pages/LoginPage.tsx` + `DashboardPage.tsx`.
- Providers outside-in: **Redux Provider → MUI ThemeProvider → BrowserRouter**.
- Routes: `/login` (PublicRoute → LoginPage), `/dashboard` (ProtectedRoute → DashboardPage), `/` → redirect to `/dashboard`.
- **Session restore:** `App` calls `restoreSession()` in `useEffect` on mount.
- **MSW-ready gate:** `App` renders `null` until `enableMocking()` resolves, so requests never
  leak to the dev server before the mock worker is active (see US0204 race note).

## TS030107 — Auth mock handlers + store

> Built on the generic MSW base ([E02 / US0204](../../conception/E02-project_preparation/US0204-mock_backend_msw.md)).

- `src/mocks/handlers/auth/` — one file per endpoint: `login.ts`, `session.ts`, `refresh.ts`, `logout.ts`, merged in `index.ts`.
- `mockStore.ts` — in-memory auth state (demo user `admin` / `password123`, `isAuthenticated`, tokens, expiry).
    - `setMockAuthenticated(value)` also writes/clears a `mock_session_active` flag in `localStorage`
      (the browser worker can't read the real httpOnly cookie, so this stands in for persistence).
    - `hasRefreshToken(request)` returns `false` when logged out (explicit logout wins); else validates cookie expiry.
- Behavior: `login` 400/401/200; `session` & `refresh` gated by `hasRefreshToken`; `logout` → 204.
- Registered in the shared `server.ts` / `handlers/browser.ts`; its store reset in `src/test/setupMSW.ts` `afterEach`.
- Tested in `src/test/mocks/login.test.ts`, `src/test/mocks/session.test.ts`.

## Test coverage (current)

| Area                           | Test file                          |
| ------------------------------ | ---------------------------------- |
| Redux slice                    | `src/test/authSlice.test.ts`       |
| API service                    | `src/test/authApi.test.ts`         |
| useAuth hook                   | `src/test/useAuth.test.tsx`        |
| ProtectedRoute                 | `src/test/protectedRoute.test.tsx` |
| LoginForm                      | `src/test/loginForm.test.tsx`      |
| Mock handlers (login, session) | `src/test/mocks/*.test.ts`         |

> Note: tests currently live under `src/test/`, not co-located with their code — this
> diverges from the "tests alongside code" rule in [US0103 coding conventions](../../conception/E01-workflow_and_conventions/US0103-coding_conventions.md). Flagged for refactoring.

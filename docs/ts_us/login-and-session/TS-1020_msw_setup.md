# TS-1020: MSW Setup

## Table of Contents

- [Short Description](#short-description)
- [Acceptance Criteria](#acceptance-criteria)
    - [Dependencies](#dependencies)
    - [Auth handlers](#auth-handlers)
    - [Tests](#tests)
- [Solution](#solution)
    - [File Structure](#file-structure)
    - [Implementation Details](#implementation-details)
    - [Test Coverage](#test-coverage)
- [Notes](#notes)

## Short Description

Frontend: Install MSW + Vitest, create auth mock handlers (login, session, refresh, logout), write handler tests.

## Acceptance Criteria

### As a frontend developer, I need MSW mock handlers so I can develop and test auth features before the backend exists.

**Acceptance criteria:**

- [ ] Auth endpoints (login, session, refresh, logout) are mocked at the network layer
- [ ] Mocks intercept `fetch` and `axios` calls in the browser
- [ ] Mocks intercept HTTP calls in tests (Vitest)
- [ ] Mock store holds test user data that can be reset between tests
- [ ] `VITE_USE_MOCKS=true` enables mocks in development
- [ ] Mock handlers have tests covering success and error cases

### Dependencies

- [ ] MSW, Vitest, @testing-library/react, @testing-library/user-event, @testing-library/dom, jsdom installed
- [ ] vitest.config.ts with jsdom environment
- [ ] eslint.config.js with Vitest rules

### Auth handlers

- [ ] `POST /auth/login` — returns 400 if missing fields, 401 if bad credentials, 200 with accessToken + refresh cookie on success
- [ ] `GET /auth/session` — returns 401 if no/expired token, 200 with user data if valid
- [ ] `POST /auth/refresh` — returns 401 if no/expired cookie, 200 with new accessToken + rotated cookie
- [ ] `POST /auth/logout` — returns 204 No Content

### Tests

- [ ] Login handler tested: 400, 401, 200 cases
- [ ] Session handler tested: 401, 200 cases

## Solution

### File Structure

```
src/mocks/
├── index.ts              → public re-exports
├── server.ts             → test server (msw/node)
├── setUp.ts              → browser worker setup
└── handlers/
    ├── browser.ts         → setupWorker for browser
    └── auth/
        ├── index.ts       → authHandlers aggregator
        ├── mockStore.ts   → in-memory store + types
        ├── login.ts
        ├── session.ts
        ├── refresh.ts
        └── logout.ts

public/
└── mockServiceWorker.js  → MSW browser worker

src/test/
└── setupMSW.ts           → test lifecycle

vitest.config.ts           → test configuration
eslint.config.js           → Vitest ESLint rules
```

### Implementation Details

#### mockStore.ts

In-memory store holding the demo user plus session bookkeeping:

```ts
mockStore = {
    user: {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123', // plain text, mock only
        roles: ['Admin', 'Superadmin'],
    },
    isAuthenticated: readPersistedAuth(), // seeded from localStorage
    accessToken: 'mock-access-token-12345',
    expiresAt, // ISO, +1h
    refreshToken: 'mock-refresh-token',
    refreshTokenExpiresAt, // ISO
};
```

Exports:

- `setMockAuthenticated(value)` — sets `isAuthenticated` **and** writes/removes the
  `mock_session_active` key in `localStorage` (no-ops in node/test).
- `hasRefreshToken(request)` — returns `false` immediately if not authenticated
  (an explicit logout always wins); otherwise validates cookie expiry when a real
  `Cookie` header is present (node/test), else returns `true`.

The browser MSW worker cannot read back the real httpOnly cookie, so
`localStorage` is the persistence stand-in: login survives a reload, logout clears it.

#### login.ts

- `POST /auth/login` — body: `{ username | email, password }`
- Returns 400 if identity or password missing
- Returns 401 if credentials don't match the demo user
- On success: `setMockAuthenticated(true)`, refreshes `refreshTokenExpiresAt`, returns
  200 with `{ accessToken, expiresAt }` + `refreshToken` httpOnly cookie

#### session.ts

- `GET /auth/session` — gated by `hasRefreshToken(request)`
- Returns 401 if not authenticated / expired
- Returns 200 with `{ user, expiresAt }` when valid

#### refresh.ts

- `POST /auth/refresh` — gated by `hasRefreshToken(request)`
- Returns 401 if not authenticated / expired
- Returns 200 with new `{ accessToken, expiresAt }` + rotates cookie on success

#### logout.ts

- `POST /auth/logout` — `setMockAuthenticated(false)` (clears the persisted flag),
  returns **204 No Content**

### Test Coverage

| Handler | Test cases                                          |
| ------- | --------------------------------------------------- |
| login   | 400 missing fields, 401 wrong password, 200 success |
| session | 401 no token, 401 expired token, 200 valid token    |

## Notes

- `VITE_USE_MOCKS=true` env var toggles MSW on/off (on by default in `.env`)
- Tests use `server.ts` (server-side MSW) instead of the browser worker
- Demo credentials: `admin` / `password123` (plain text in the mock store)
- MSW handlers are endpoint-specific files, merged in `handlers/auth/index.ts`
- **setUp.ts caches the `worker.start()` promise.** React StrictMode invokes the
  startup effect twice; caching the promise makes the second call await the _same_
  activation instead of starting the worker twice ("already enabled" error) or
  resolving early — which previously let `GET /auth/session` leak through to the Vite
  dev server (returning `index.html`) and falsely authenticate the user.
- Session persistence is a `localStorage` flag (`mock_session_active`), since the
  browser worker can't replicate a real httpOnly refresh cookie. To switch to a real
  backend instead, see [TS-1022](./TS-1022_auth_api_service.md#real-api-server).

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

In-memory store holding test user:

```ts
{
  id: 'user-1',
  username: 'admin',
  email: 'admin@madrassa.ai',
  passwordHash: '$2b$12$...', // plain: 'password123'
  roles: ['Admin'],
  isActive: true,
  isLocked: false
}
```

#### login.ts

- `POST /auth/login` — body: `{ username, password }`
- Returns 400 if username or password missing
- Returns 401 if password hash doesn't match
- Returns 200 with `{ accessToken: string }` + `refreshToken` httpOnly cookie on success

#### session.ts

- `GET /auth/session` — reads `Authorization: Bearer <token>` header
- Returns 401 if no token or expired token
- Returns 200 with `{ user: {...}, expiresAt: ISO string }` on valid token

#### refresh.ts

- `POST /auth/refresh` — reads `refreshToken` httpOnly cookie
- Returns 401 if no cookie or expired
- Returns 200 with new `{ accessToken: string }` + rotates cookie on success

#### logout.ts

- `POST /auth/logout` — clears refreshToken cookie, returns 200

### Test Coverage

| Handler | Test cases                                          |
| ------- | --------------------------------------------------- |
| login   | 400 missing fields, 401 wrong password, 200 success |
| session | 401 no token, 401 expired token, 200 valid token    |

## Notes

- `VITE_USE_MOCKS=true` env var toggles MSW on/off (off by default)
- Tests use `server.ts` (server-side MSW) instead of browser worker
- Test user passwordHash is a bcrypt hash of `'password123'`
- MSW handlers are endpoint-specific files, merged in `handlers/index.ts`

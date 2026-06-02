# TS-1022: Auth API Service

Axios instance with auth endpoints and auto-refresh interceptor.

## Description

Provides HTTP client for auth endpoints with automatic token refresh on 401 responses.

## File Structure

```
src/api/
├── client.ts       # Shared axios client factory
└── auth/
    ├── index.ts    # Public exports
    ├── types.ts    # TypeScript interfaces
    └── authApi.ts  # Auth endpoints
```

## Key Patterns

### Shared Axios Client (`src/api/client.ts`)

`createApiClient(baseUrl)` creates a configured axios instance with:

- `withCredentials: true` so the httpOnly refresh cookie is sent
- Request interceptor that adds `Authorization: Bearer <token>` header
- Response interceptor that auto-refreshes token on 401
- Concurrent refresh deduplication via `refreshPromise` singleton

### Base URL — MSW vs Real API switch

```ts
export const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
export const apiClient = createApiClient(BASE_URL);
```

- **Mock mode** (default): `VITE_API_BASE_URL` unset → `BASE_URL = ''` → requests are
  relative (`/auth/...`) and MSW intercepts them in the browser.
- **Real API mode**: set `VITE_USE_MOCKS=false` and
  `VITE_API_BASE_URL=http://localhost:3001` to hit the standalone auth server
  (`../madrassa-ai-server`). The raw `POST /auth/refresh` call inside the interceptor
  is also prefixed with `BASE_URL` so refresh targets the same origin.

### Token Storage

- **Access token**: stored in memory via `setAccessToken()`/`getAccessToken()`
- **Refresh token**: handled automatically via httpOnly cookie

### Auto-Refresh Interceptor

1. Catches 401 responses (guards `_retry` so it runs once per request)
2. Calls `POST ${BASE_URL}/auth/refresh` to get a new access token
3. Retries the original request with the new token
4. Deduplicates concurrent refresh requests via the `refreshPromise` singleton
5. On refresh failure: clears the access token and rejects (redirect to `/login` is
   handled by the route guards, not the client)

### Endpoints

| Method | Function               | Description                        |
| ------ | ---------------------- | ---------------------------------- |
| POST   | `authApi.login(data)`  | Authenticate, returns access token |
| GET    | `authApi.getSession()` | Get current user session           |
| POST   | `authApi.refresh()`    | Rotate tokens                      |
| POST   | `authApi.logout()`     | Revoke session                     |

## Usage

```typescript
import { authApi, setAccessToken, getAccessToken, apiClient } from '@/api/auth';
import { createApiClient } from '@/api/client';

// Auth operations
const { accessToken } = await authApi.login({ username, password });
const { user } = await authApi.getSession();
await authApi.logout();

// Create API client for other services
const userApi = createApiClient(import.meta.env.VITE_API_BASE_URL ?? '');
```

## Real API server

`../madrassa-ai-server` is an Express app implementing the same auth contract with a
real httpOnly refresh cookie. See its `README.md` for run instructions and the env
vars needed to switch the frontend over.

## Dependencies

- `axios` — HTTP client

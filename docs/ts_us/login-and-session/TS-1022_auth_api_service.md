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

- Request interceptor that adds `Authorization: Bearer <token>` header
- Response interceptor that auto-refreshes token on 401
- Concurrent refresh deduplication via `refreshPromise` singleton

### Token Storage

- **Access token**: stored in memory via `setAccessToken()`/`getAccessToken()`
- **Refresh token**: handled automatically via httpOnly cookie

### Auto-Refresh Interceptor

1. Catches 401 responses
2. Calls `POST /auth/refresh` to get new access token
3. Retries original request with new token
4. Deduplicates concurrent refresh requests via `refreshPromise` singleton
5. Redirects to `/login` if refresh fails

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
const userApi = createApiClient('/api');
```

## Dependencies

- `axios` — HTTP client

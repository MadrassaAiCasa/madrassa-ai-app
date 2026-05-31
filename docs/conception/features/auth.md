# Auth

## Overview

Authentication uses **access token + refresh token** pattern. Access token is short-lived, stored in memory. Refresh token is long-lived, stored in httpOnly cookie.

## Endpoints

| Method | Path            | Auth           | Returns                                       |
| ------ | --------------- | -------------- | --------------------------------------------- |
| POST   | `/auth/login`   | None           | `{ accessToken, expiresAt }` + refresh cookie |
| GET    | `/auth/session` | Refresh cookie | `{ user, expiresAt }`                         |
| POST   | `/auth/refresh` | Refresh cookie | `{ accessToken, expiresAt }`                  |
| POST   | `/auth/logout`  | Refresh cookie | `204 No Content`                              |

Full contract in [openapi.yaml](./openapi.yaml).

## Token Flow

```
Login
  → POST /auth/login (username/email + password)
  ← { accessToken, expiresAt } + refreshToken cookie (httpOnly)

Session restore (on app load)
  → GET /auth/session (cookie: refreshToken)
  ← { user, expiresAt }

Auto-refresh (before access token expires)
  → POST /auth/refresh (cookie: refreshToken)
  ← { accessToken, expiresAt } + rotated refresh cookie

Logout
  → POST /auth/logout (cookie: refreshToken)
  ← 204 No Content
```

## Mock

Mock handlers are in `src/mocks/handlers/auth/`. Tests use `src/test/setupMSW.ts`. See [backend_mock.md](./backend_mock.md).

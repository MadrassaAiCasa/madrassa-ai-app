# TS-1025: useAuth Hook

Typed hook wrapping Redux auth state and API calls.

## Description

Provides a simple interface for auth operations: login, logout, and session restore.

## File Structure

```
src/store/
├── useAuth.ts   # useAuth hook
└── ...
```

## API

```typescript
const { user, isAuthenticated, isLoading, login, logout, restoreSession } = useAuth();
```

### Return Value

| Property          | Type                                    | Description                 |
| ----------------- | --------------------------------------- | --------------------------- |
| `user`            | `User \| null`                          | Current user                |
| `isAuthenticated` | `boolean`                               | Auth status                 |
| `isLoading`       | `boolean`                               | Loading state               |
| `login`           | `(data: LoginRequest) => Promise<void>` | Login action                |
| `logout`          | `() => Promise<void>`                   | Logout action               |
| `restoreSession`  | `() => Promise<void>`                   | Restore session on app load |

## Usage

```typescript
import { useAuth } from '@/store';

// Login
await useAuth().login({ username, password });

// Logout
await useAuth().logout();

// Restore session (on app load)
await useAuth().restoreSession();
```

## Dependencies

- `@reduxjs/toolkit`
- `react-redux`

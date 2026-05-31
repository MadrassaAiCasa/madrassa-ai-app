# TS-1021: Auth Redux Slice

Redux slice for auth state management.

## Description

Manages authentication state including user, tokens, and loading state.

## File Structure

```
src/store/
├── index.ts       # Store configuration and exports
├── authSlice.ts   # Auth Redux slice
└── hooks.ts       # Typed hooks (useAppDispatch, useAppSelector)
```

## State Shape

```typescript
interface AuthState {
    user: User | null;
    tokens: {
        accessToken: string | null;
        expiresAt: string | null;
    };
    isAuthenticated: boolean;
    isLoading: boolean;
}
```

## Actions

| Action             | Payload            | Description                                    |
| ------------------ | ------------------ | ---------------------------------------------- |
| `setCredentials`   | `{ user, tokens }` | Set user and tokens, mark as authenticated     |
| `clearCredentials` | —                  | Clear all credentials, mark as unauthenticated |
| `setLoading`       | `boolean`          | Set loading state                              |

## Usage

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCredentials, clearCredentials, setLoading } from '@/store';

// In component
const dispatch = useAppDispatch();
const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
```

## Dependencies

- `@reduxjs/toolkit` — Redux state management
- `react-redux` — React bindings for Redux

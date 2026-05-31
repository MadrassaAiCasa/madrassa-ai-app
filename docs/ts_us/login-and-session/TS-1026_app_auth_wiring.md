# TS-1026: App Auth Wiring

App.tsx wiring with all auth providers and routes.

## Description

Wires together MUI ThemeProvider, Redux Provider, React Router, ProtectedRoute, and session restore on app load.

## File Structure

```
src/
├── App.tsx       # Main app with providers
└── ...
```

## Providers (inside-out)

1. **Provider** (Redux) — provides auth store
2. **ThemeProvider** (MUI) — provides Material UI theme
3. **BrowserRouter** (React Router) — provides routing context

## Routes

| Path         | Component                | Auth Required        |
| ------------ | ------------------------ | -------------------- |
| `/login`     | `LoginForm`              | No                   |
| `/dashboard` | Dashboard                | Yes (ProtectedRoute) |
| `/`          | Redirect to `/dashboard` | —                    |

## Session Restore

On app load, `restoreSession()` is called in `useEffect` to check for existing session via refresh token cookie.

## Dependencies

- `@mui/material` — UI components
- `@emotion/react`, `@emotion/styled` — MUI styling
- `react-redux` — Redux bindings
- `react-router-dom` — routing

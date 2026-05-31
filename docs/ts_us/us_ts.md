# TS/US Checklist

## Next Features

- [x] TS-1022: Auth API Service — axios instance + endpoints (login, getSession, refresh, logout), auto-refresh interceptor
- [x] TS-1021: Auth Redux Slice — auth state (user, tokens, isAuthenticated), reducers (setCredentials, clearCredentials, setLoading)
- [x] TS-1025: useAuth Hook — typed hook wrapping useSelector/useDispatch for auth state
- [x] TS-1023: ProtectedRoute — redirects to /login if unauthenticated, shows spinner while checking session
- [ ] TS-1024: LoginForm UI — username/email + password form, error display, loading state
- [ ] TS-1026: App Auth Wiring — MUI ThemeProvider + Redux Provider + Router + ProtectedRoute + session restore in App.tsx

## Login & Session

| TS      | Title            | Status  | Doc                                                                            |
| ------- | ---------------- | ------- | ------------------------------------------------------------------------------ |
| TS-1020 | MSW Setup        | ✅ Done | [TS-1020_msw_setup.md](./login-and-session/TS-1020_msw_setup.md)               |
| TS-1021 | Auth Redux Slice | ✅ Done | [TS-1021_auth_redux_slice.md](./login-and-session/TS-1021_auth_redux_slice.md) |
| TS-1022 | Auth API Service | ✅ Done | [TS-1022_auth_api_service.md](./login-and-session/TS-1022_auth_api_service.md) |
| TS-1023 | ProtectedRoute   | ✅ Done | [TS-1023_protected_route.md](./login-and-session/TS-1023_protected_route.md)   |
| TS-1025 | useAuth Hook     | ✅ Done | [TS-1025_use_auth_hook.md](./login-and-session/TS-1025_use_auth_hook.md)       |

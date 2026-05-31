# TS/US Checklist

## Next Features

- [ ] TS-1022: Auth API Service — axios instance + endpoints (login, getSession, refresh, logout), auto-refresh interceptor
- [ ] TS-1021: Auth Redux Slice — auth state (user, tokens, isAuthenticated), reducers (setCredentials, clearCredentials, setLoading)
- [ ] TS-1025: useAuth Hook — typed hook wrapping useSelector/useDispatch for auth state
- [ ] TS-1023: ProtectedRoute — redirects to /login if unauthenticated, shows spinner while checking session
- [ ] TS-1024: LoginForm UI — username/email + password form, error display, loading state
- [ ] TS-1026: App Auth Wiring — MUI ThemeProvider + Redux Provider + Router + ProtectedRoute + session restore in App.tsx

## Login & Session

| TS      | Title     | Status  | Doc                                                              |
| ------- | --------- | ------- | ---------------------------------------------------------------- |
| TS-1020 | MSW Setup | ✅ Done | [TS-1020_msw_setup.md](./login-and-session/TS-1020_msw_setup.md) |

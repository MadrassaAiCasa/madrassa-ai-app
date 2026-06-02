# TS-1024: LoginForm UI

Login form (MUI) with username/email + password fields.

## Description

A Material UI form component for user authentication, with error display, loading
state, and redirect to `/dashboard` on success.

## File Structure

```
src/components/auth/
├── LoginForm.tsx   # Component
└── ...
```

## Props

None (uses the `useAuth` hook internally).

## Features

- Username or email input (MUI `TextField`)
- Password input (MUI `TextField`, `type="password"`)
- Submit button (MUI `Button`) with a `CircularProgress` spinner while loading
- Inputs and button disabled while `isLoading`
- Error message via MUI `Alert` (`role="alert"`) on failed login
- On success: `navigate('/dashboard', { replace: true })`

## Key Patterns

- Layout via MUI `Box` (`component="form"`) with `sx` styling — no plain HTML
  inputs. Note: MUI v9 does not forward shorthand props like `textAlign` to the
  DOM; put them inside `sx`.
- Redirect uses `useNavigate` from `react-router-dom`, so the component must render
  inside a Router (tests wrap it in `MemoryRouter`).

## Usage

```typescript
import { LoginForm } from '@/components/auth';

<LoginForm />;
```

## Dependencies

- `react`
- `@mui/material` — `Box`, `TextField`, `Button`, `Alert`, `CircularProgress`, `Typography`
- `react-router-dom` — `useNavigate`
- `@/store` — `useAuth` hook

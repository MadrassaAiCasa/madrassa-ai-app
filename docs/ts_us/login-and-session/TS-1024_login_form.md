# TS-1024: LoginForm UI

Login form with username/email + password fields.

## Description

A form component for user authentication with error display and loading state.

## File Structure

```
src/components/auth/
├── LoginForm.tsx   # Component
└── ...
```

## Props

None (uses `useAuth` hook internally).

## Features

- Username or email input field
- Password input field
- Loading state with disabled inputs
- Error message display

## Usage

```typescript
import { LoginForm } from '@/components/auth';

<LoginForm />
```

## Dependencies

- `react`
- `@/store` (useAuth hook)

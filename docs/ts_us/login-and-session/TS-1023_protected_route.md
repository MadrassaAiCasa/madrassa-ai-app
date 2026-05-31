# TS-1023: ProtectedRoute

Route guard that redirects to login when unauthenticated.

## Description

A wrapper component that protects routes requiring authentication. Shows loading spinner while checking session status.

## File Structure

```
src/components/auth/
├── index.ts            # Exports
└── ProtectedRoute.tsx  # Component
```

## Props

```typescript
interface ProtectedRouteProps {
    children: React.ReactNode;
}
```

## Behavior

| State                       | Render               |
| --------------------------- | -------------------- |
| `isLoading === true`        | Loading indicator    |
| `isAuthenticated === false` | Redirect to `/login` |
| `isAuthenticated === true`  | Render children      |

## Usage

```typescript
import { ProtectedRoute } from '@/components/auth';

// In router
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## Dependencies

- `react-router-dom` — routing

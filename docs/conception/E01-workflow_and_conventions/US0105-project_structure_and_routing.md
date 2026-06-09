# Structure & Routing

## Short Description

Set up feature-based folder structure with routing config for the frontend app.

## Description

Establish the project's folder structure and routing conventions. Features are self-contained, co-located with their own components, hooks, types, and API calls. Routing is centralized in a `routes/` config with thin page components.

## 1. Feature-Based Folder Structure

Each feature is self-contained with its own pages, components, api, hooks, types, and utils. Easy to delete, move, or onboard to one feature at a time.

```
src/
  features/
    products/
    users/
  shared/
    ui/          → design system primitives (Button, Input, Card)
    hooks/       → cross-feature hooks
    components/  → cross-feature shared components
```

## 2. Per-Feature Internal Structure

```
features/
  products/
    components/
    api/
    hooks/
    types/
    utils/
    constants/
    index.ts      → public exports
  users/
    components/
    api/
    hooks/
    types/
    utils/
    index.ts
```

## 3. Per-Component Internal Structure (co-located)

Each component has its own folder with co-located styles and tests:

```
UserCard/
  UserCard.tsx
  UserCard.module.css
  UserCard.test.tsx
  index.ts
```

## 4. Route Config Structure

```
pages/ → route view components (thin, connect routing to children)
routes/
  index.tsx         → all Routes defined here
  paths.ts          → path constants (Home: '/', Products: '/products', etc.)
  RouteGuard.tsx    → optional route guard wrapper
```

- `pages/` for route views only — no routing logic
- `routes/` for routing config only
- `paths.ts` centralizes all path strings
- a **route guard** wraps routes that need a condition checked before rendering
  (e.g. redirect when some requirement isn't met)

## 5. Presentation/Logic Separation

Use **hooks** to extract logic — no container/wrapper components needed.

```
hooks/useUsers.ts → all data/logic (fetch, state, filtering)
UserList.tsx      → just presentation, calls useUsers()
```

## Notes

- Features can be deleted or moved without affecting other parts of the app
- All feature public API is exposed through `index.ts`
- Routing lives in `routes/` — page components in `pages/` are thin wrappers
- Shared utilities (UI primitives, cross-cutting hooks) live in `shared/`

# E03 — Authentication

## Goal

- Give an **admin-facing** app secure sign-in and session handling.
- Make sure **only authorized staff** can reach the system and its data.

## Who uses it (personas)

- **Superadmin** — full access.
- **Admin** — manages the school’s day-to-day data.
- **Teacher** — limited access to their own scope.

## Why we need it

- The app holds **sensitive school data** (students, grades, staff) — it must not be open.
- Access must be **restricted to known accounts**, never anonymous.
- Sessions must be **secure**: short-lived access tokens, long-lived refresh kept out of JS.
- We must **limit abuse** (repeated login attempts) and **keep a trail** of key actions.

## Use cases

- A user logs in with **username/email + password**.
- A logged-in user **stays signed in across page reloads** (session restored automatically).
- An expired access token is **refreshed silently**, with no re-login.
- A user **logs out**, ending the session everywhere it’s checked.
- A not-logged-in user is **blocked from protected pages** and sent to login.
- _(future)_ A user **resets a forgotten password** by email.
- _(future)_ A user with a temporary password is **forced to change it** on next login.
- _(future)_ An account is **locked after repeated failed logins**.
- _(future)_ Key actions are **recorded for audit** and viewable by admins.

## Security model

- **Access token** — short-lived, stored **in memory** (lost on tab close).
- **Refresh token** — long-lived, stored in an **httpOnly cookie**, **rotated** on each refresh.
- **Endpoints**: `POST /auth/login`, `GET /auth/session`, `POST /auth/refresh`, `POST /auth/logout`.
- Data model in [entities.md](../common/entities.md); full contract in [openapi.yaml](../common/openapi.yaml).

## User Stories

| ID     | User Story             | Covers                                                                                                                         | Status      |
| ------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| US0301 | Login & Session        | login, session restore, token refresh, logout, route protection — [US0301-login_and_session.md](./US0301-login_and_session.md) | Done        |
| US0302 | Password reset         | "forgot password" via email, set new password                                                                                  | To Do       |
| US0303 | Forced password change | `mustChangePassword` → change on next login                                                                                    | To Do       |
| US0304 | Brute-force protection | track `LoginAttempt`, lock account (`isLocked`) after N failures                                                               | To validate |
| US0305 | Audit log              | record significant actions (`AuditLog`), viewable by admins                                                                    | To Do       |

> RBAC (roles & permissions) and user management are out of scope for E03 —
> to be defined as separate Epic(s) later.

## Progress

- **📝 Conception:** —
- **🔎 To validate:** US0304
- **⏸️ Standby:** —
- **🟥 To Do:** US0302, US0303, US0305
- **🟨 In Progress:** —
- **🟩 Done:** US0301

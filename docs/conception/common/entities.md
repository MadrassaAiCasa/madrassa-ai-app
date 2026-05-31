# Entities

Short description: Shared data model for all auth features.

---

## User

| Field              | Type      | Notes                                     |
| ------------------ | --------- | ----------------------------------------- |
| id                 | UUID      | PK                                        |
| email              | string    | unique, used for password reset and login |
| username           | string    | unique, used for login                    |
| passwordHash       | string    |                                           |
| mustChangePassword | boolean   | force password change on next login       |
| isLocked           | boolean   | account locked (brute-force protection)   |
| isActive           | boolean   | soft delete                               |
| createdAt          | timestamp |                                           |
| updatedAt          | timestamp |                                           |

---

## Role

| Field       | Type    | Notes                                         |
| ----------- | ------- | --------------------------------------------- |
| id          | UUID    | PK                                            |
| name        | string  | unique (Admin, Teacher, Superadmin)           |
| description | string  | optional                                      |
| isSystem    | boolean | prevents role from being modified or deleted  |
| isActive    | boolean | deactivates role and removes from assignments |

---

## Permission

| Field       | Type   | Notes                                        |
| ----------- | ------ | -------------------------------------------- |
| id          | UUID   | PK                                           |
| name        | string | unique (create:user, edit:user, view:grades) |
| description | string | optional                                     |

---

## UserRole

| Field  | Type | Notes     |
| ------ | ---- | --------- |
| id     | UUID | PK        |
| userId | UUID | FK → User |
| roleId | UUID | FK → Role |

Unique constraint on (userId, roleId).

---

## RolePermission

| Field        | Type | Notes           |
| ------------ | ---- | --------------- |
| id           | UUID | PK              |
| roleId       | UUID | FK → Role       |
| permissionId | UUID | FK → Permission |

Unique constraint on (roleId, permissionId).

---

## RefreshToken

| Field      | Type      | Notes                 |
| ---------- | --------- | --------------------- |
| id         | UUID      | PK                    |
| userId     | UUID      | FK → User             |
| tokenHash  | string    | hashed refresh token  |
| ipAddress  | string    | session origin        |
| userAgent  | string    | browser/device info   |
| lastUsedAt | timestamp | last refresh call     |
| expiresAt  | timestamp |                       |
| createdAt  | timestamp |                       |
| revokedAt  | timestamp | null = active session |

---

## LoginAttempt

| Field       | Type      | Notes     |
| ----------- | --------- | --------- |
| id          | UUID      | PK        |
| userId      | UUID      | FK → User |
| attemptedAt | timestamp |           |
| ipAddress   | string    |           |
| success     | boolean   |           |

---

## AuditLog

| Field     | Type      | Notes                                |
| --------- | --------- | ------------------------------------ |
| id        | UUID      | PK                                   |
| userId    | UUID      | FK → User                            |
| action    | string    | e.g. LOGIN, CREATE_USER, DELETE_USER |
| resource  | string    | e.g. user:123, role:admin            |
| timestamp | timestamp |                                      |
| ipAddress | string    |                                      |

---

## Relationships

```
User
  ├─←UserRole──→Role
  │                └─←RolePermission──→Permission
  ├─←RefreshToken (one session per device)
  ├─←LoginAttempt
  └─←AuditLog
```

---

## Notes

- User ↔ Role is many-to-many via UserRole
- Role ↔ Permission is many-to-many via RolePermission
- RefreshToken: one entry per active session (user can be logged in on multiple devices)
- LoginAttempt: one entry per login attempt (success or failure)
- AuditLog: one entry per significant action

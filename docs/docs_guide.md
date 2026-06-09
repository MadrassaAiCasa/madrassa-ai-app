# Docs Guide

The **single source of truth** for how our `docs/` folder works. Anyone — human
or AI agent — should read this and know where things live, how to write them, and
how each phase feeds the next.

---

## The 4 Phases

| Phase                      | View                    | Produces                | Relation                                    |
| -------------------------- | ----------------------- | ----------------------- | ------------------------------------------- |
| **Discovery**              | Product idea            | **Epics**               | 1 Epic → many User Stories                  |
| **Requirements**           | End-user view           | **User Stories**        | 1 User Story → many Technical Stories       |
| **Design**                 | Technical view          | **Technical Stories**   | written inside the User Story file          |
| **Build / Implementation** | What was actually built | **Implementation docs** | one doc per User Story, organized by its TS |

Chain: **Epic → User Story → Technical Story → Build.**

---

## Folder Layout

`conception/` (the plan) and `implementation/` (what got built) share the same
Epic folders.

```
docs/
├── docs_guide.md                ← this file
│
├── conception/
│   ├── index.md                 ← master Epic list (goal + link to each Epic main file)
│   ├── common/                  ← shared API contracts (entities, endpoints, openapi)
│   │
│   ├── E03-authentication/                      ← one folder per Epic: E<NN>-snake_name
│   │   ├── E03-authentication.md                ← Epic main file (same name as folder)
│   │   ├── US0301-login_and_session.md          ← a User Story file (+ its TS table)
│   │   └── US0302-password_reset.md
│   └── <E..-other_epic>/
│
└── implementation/
    └── E03-authentication/                       ← mirrors conception (same Epic folders)
        └── US0301-login_and_session-imp.md       ← one file per User Story, organized by TS
```

---

## Naming & references

- **Epic** — `E<NN>` (e.g. `E03`). Folder `E<NN>-snake_name`; its **main file has the
  same name as the folder**.
- **User Story** — `US<EE><NN>` (Epic + 2 digits, e.g. `US0301`). File
  `US<EE><NN>-snake_title.md`.
- **Technical Story** — `TS<EE><NN><TT>` (US ref + 2 digits, e.g. `TS030101`).
  Defined **inside** the User Story's conception file (TS table).
- **Implementation file** — same US ref + `-imp` suffix (e.g.
  `US0301-login_and_session-imp.md`).

References travel across phases: point to `US0301` / `TS030101`, not a long title.

---

## What goes in each file

### Epic main file (`E<NN>-name.md`)

- **Goal**, **personas**, **why we need it**, **use cases**, security/contract notes.
- A **User Stories table** (ID · story · covers · status).
- A **Progress board** (lifecycle order: **Conception → To validate → Standby → To Do → In Progress → Done**).
  This is the dashboard — there is no central progress file; status lives per Epic.

### User Story file — conception (`US<EE><NN>-title.md`)

- The **user story** (`As a … I need … so that …`).
- **Description**, **Why**, **How it should work**, **What should be done (rules)**.
- A **Technical Stories table** (ID · TS · what to do · status).
- Link to its implementation file.

### User Story file — implementation (`…-imp.md`)

- **One file per User Story**, organized into a **section per Technical Story**.
- Documents what was actually built: real file paths, key patterns, decisions, tests.
- Link back to the conception file.

---

## Conventions live as docs too

Workflow and standards (git flow, coding conventions, structure, formatting, mocks)
are themselves Epics/User Stories:

- **E01 — Workflow & conventions**
- **E02 — Project preparation**

`conception/common/` holds cross-feature API contracts shared by all Epics.

---

## Rules

- `conception/index.md` is the master list of Epics — each row links to the Epic main file.
- Each Epic is a **folder**; the file named like the folder is its main file.
- Each User Story is **its own file** and contains its Technical Stories.
- `implementation/` mirrors `conception/` (same Epic folders), one `-imp` file per User Story.
- Keep each Epic's **Progress board** current — that is where status is tracked.

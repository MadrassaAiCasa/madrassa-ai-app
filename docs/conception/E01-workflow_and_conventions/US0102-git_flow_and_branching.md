# Git Flow Branching Strategy

## Short Description

This repository follows the **Git Flow** workflow to manage releases and feature development using specific branch types.

## Description

Establish the branching and merge strategy for the project. Developers work on feature branches off `develop`, then merge back via PRs. Hotfixes branch off `main` and merge to both `main` and `develop`.

## Core Branches

- **`main`**
    - **Purpose:** Production-ready code only.
    - **Access:** Protected. No direct commits.
    - **Rule:** Every commit must be tagged with a version number (e.g., `v1.0.0`).
- **`develop`**
    - **Purpose:** Main integration branch for the next release.
    - **Access:** Protected.
    - **Rule:** All features target this branch via Pull Requests (PRs).

## Branch Diagram

```
[main]      ---------------------------------------> (Production)
              \                                ^ ^
               \---> [hotfix/*] ---CODE----->/   | (Release merge)
                 \                        /  |   |
                  ----------------------/    |   |
                                             |   |
                             (Hotfix merge)  v   |
[develop]   ---------------------------------------> (Integration)
              \                                 ^
               \-->[(feature/bug)/*] ---CODE-->/
```

## Supporting Branches

### 1. Feature Branches

- **Branch off:** `develop`
- **Merge into:** `develop`
- **Naming Convention:** `feature/<snake_case_title>` or `fix/<snake_case_title>` — e.g. `feature/product_list`, `fix/cart_total`
- **Usage:** One branch per feature. Each branch contains as many commits as there are US/TS tasks inside it. One PR per feature, not per task.

### 2. Hotfix Branches (`hotfix/*`)

- **Branch off:** `main`
- **Merge into:** `main` **and** `develop`
- **Naming Convention:** `hotfix/vX.Y.Z`
- **Usage:** Used for immediate production patches. Once fixed, the PR must target both `main` (with a new tag) and `develop` to prevent regression.

## Commit Messages

We use **Conventional Commits**: `<type>(<ref>): <subject>`.

- **type:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, etc.
- **ref (scope):** the task reference — `US<EE><NN>` or `TS<EE><NN><TT>`. Omit the
  scope for non-task commits (e.g. `docs: ...`, `chore: ...`).
- **subject:** short, imperative, lower-case.
- **Body (optional):** blank line after the title, then what was done and why.

Example:

```
feat(TS040101): add product list page

Add the product list UI and data wiring. Presentation only;
logic handled by the useProducts hook. Includes unit tests.
```

---

## Notes

- Never push directly to `main` or `develop` — all changes go through PRs
- Feature branches are deleted after merge
- Hotfixes require two PRs: one to `main` (with version tag) and one to `develop`
- **One branch per feature.** Each feature branch contains as many commits as there are US/TS tasks inside it. One PR per feature, not per task.
- **Commit format per task:** Conventional Commits `<type>(<ref>): <subject>` — e.g. `feat(TS040101): add product list page`

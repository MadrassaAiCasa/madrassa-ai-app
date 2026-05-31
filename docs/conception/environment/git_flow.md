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
- **Naming Convention:** `(us/ts/bug_ref)-short_description`
- **Usage:** Used for developing new features, enhancements, or non-urgent bug fixes.

### 2. Hotfix Branches (`hotfix/*`)

- **Branch off:** `main`
- **Merge into:** `main` **and** `develop`
- **Naming Convention:** `hotfix/vX.Y.Z`
- **Usage:** Used for immediate production patches. Once fixed, the PR must target both `main` (with a new tag) and `develop` to prevent regression.

## Notes

- Never push directly to `main` or `develop` — all changes go through PRs
- Feature branches are deleted after merge
- Hotfixes require two PRs: one to `main` (with version tag) and one to `develop`

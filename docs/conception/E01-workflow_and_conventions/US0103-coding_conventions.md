# Coding Best Practices

> **Audience:** the Claude agent working on this project.
> **Scope:** rules to follow **while coding**. The agent currently does coding and assists with conception only.

The agent should read the section(s) relevant to the project it is working on:
**Common** (always) + **Frontend** _or_ **Backend** depending on the active project.

---

## 0. How the agent works (read first)

- Always consult the **`docs/`** folder before and during work (see [docs_guide.md](../../docs_guide.md)):
    - **`conception/`** — Epics, User Stories, and Technical Stories (what we need and how).
        - `common/` — shared API contracts, entities, and schemas used across features.
        - One folder per Epic (`E<NN>-name/`), each with its User Story files.
    - **`implementation/`** — what was actually built, mirroring the conception Epic folders.
- Follow the **rules and structure** strictly. Implementation details are free as long as the rules are respected.
- Keep the current Epic's **Progress board** up to date: what's done, in progress, and next. This is the checkpoint so work can resume cleanly after a pause.
- Formatting and linting are enforced by tooling (formatter + linter + pre-commit hook). A commit will not pass if there are issues. The agent should still follow the conventions up front to avoid friction.

---

## 1. Common rules (frontend + backend)

### Naming

- **camelCase** for variables and functions.
- **PascalCase** for components and classes.
- (Largely covered by the linter, but follow it anyway.)

### Tests

- High coverage is expected — tests are cheap to generate, so aim high.
- **Tests live in the same folder as the code** they cover (component, hook, service, etc.) — not in a separate top-level test folder.

### Comments

- **JSDoc only for complex functions.**
- Brief comments for non-obvious / "weird" variables.
- Keep otherwise-clear code comment-free.

### Documentation

- Code-level docs follow the comment rules above.
- Feature/task documentation lives in **`docs/conception/`** and **`docs/implementation/`** — not scattered in code.

### Utilities

- Shared helpers used across features → **common** folder.
- Helpers used by a single feature → that **feature's** folder.

---

## 2. Frontend rules

### Structure (feature-based)

```
src/
  features/
    <feature>/
      api/          # data fetching for the feature
      pages/        # route-level pages
      components/   # presentation components
      hooks/        # logic & data handling
  common/           # shared code across features
```

### Presentation vs logic

- **Components = presentation only** (UI + style).
- **Hooks = logic and data.** Keep presentation separated from logic.

### Component folders

- Each component has its **own folder** containing the component file, its styles, and its tests together.

### Error handling

- **Error boundaries** to catch React component errors.
- **try/catch** for async operations and complex logic.
- Show **friendly, specific** user-facing messages (avoid generic "something went wrong" when a clearer message is safe).
- Log detailed errors for debugging.
- **Validate inputs** before processing.

### Performance

- Avoid unnecessary re-renders.
- Lazy-load components where it helps.
- Keep bundle size in mind.

---

## 3. Backend rules

### Structure (feature-based + layered)

```
src/
  features/
    <feature>/
      controllers/   # handle HTTP requests & responses
      services/      # business logic
      repositories/  # database queries / data access
      utils/         # feature-specific helpers (only if not shared)
      # tests live alongside the files above
  common/            # shared code, middleware, utilities, db connections
```

### Layer responsibilities

- **Controllers** — receive HTTP requests, return responses; no business logic.
- **Services** — business logic; orchestrate repositories and utilities.
- **Repositories** — database access only (MongoDB / future Redis).
- **Utilities** — shared helpers (common folder if used everywhere, feature folder if local).

### Tests

- Same rule as common: tests in the same folder as the code.

---

## 4. Git workflow

> Branching strategy is defined in [git_flow.md](./git_flow.md). Read it for branch types, naming conventions, and hotfix rules.

### Per-step (per-task) loop

For each task (user story / technical story) inside the feature branch:

1. Agent implements the task.
2. Agent **writes tests and runs them**.
3. If tests pass, agent **asks the user to validate** (user tests manually).
4. **User validates** → agent stages files and **commits**, then moves to the next task.
   **User requests changes** → agent adjusts the code and repeats.

### End of feature

- After the last task, the user validates the **whole feature**.
- Add **fix commits** if needed.
- **Push the branch** to GitHub and **open a pull request** into `develop`.

### Commit message format

We use **Conventional Commits**: `<type>(<ref>): <subject>`.

- **type:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, etc.
- **ref (scope):** the task reference — `US<EE><NN>` or `TS<EE><NN><TT>`. Omit for non-task commits.
- **subject:** short, imperative, lower-case. Detail goes in the body.

Example:

```
feat(TS040101): add product list page

Add the product list UI and data wiring. Presentation only;
logic handled by the useProducts hook. Includes unit tests.
```

---

## 5. Quick checklist for the agent

- [ ] Read `docs/docs_guide.md` and the relevant Epic/User Story under `docs/conception/`.
- [ ] Follow Common rules + the rules for the active project (frontend or backend).
- [ ] Keep presentation and logic separated (frontend) / respect layers (backend).
- [ ] Write tests alongside the code; aim for high coverage.
- [ ] Update the Epic file's Progress board.
- [ ] Per task: code → test → ask to validate → commit on approval, else adjust.
- [ ] Commit message: Conventional Commits `<type>(<ref>): <subject>` + optional body.
- [ ] End of feature: validate, fix commits if needed, push, open PR to `develop`.

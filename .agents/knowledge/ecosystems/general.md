# ⚙️ General & Architecture Ecosystem Knowledge

Universal architecture invariants, git workflows, security practices, and agent execution patterns.

---

## 🏗️ Verified Build Flows & Engineering Patterns

### 1. Clean Git Commit & Push Verification
- **Invariant**: Never push uninspected history; verify with `git status` and run pre-flight checklist.
- **Atomic Commits**: Group related changes logically. Write imperatively formatted commit messages (`feat: ...`, `fix: ...`, `refactor: ...`).

### 2. AAA Unit Testing Standard
- **Structure**:
  - **Arrange**: Initialize dependencies, mock network/DB boundaries, setup test state.
  - **Act**: Execute the specific function or method under test.
  - **Assert**: Validate return values, state mutations, and mock interactions.
- **Coverage**: Focus test density on pure domain logic, boundary validation, and error edge cases.

### 3. Blast Radius Management
- **Scope Isolation**: Declare target file list and module boundaries before applying changes.
- **Regression Prevention**: Run pre-existing tests before edits to establish a clean baseline; verify after edits to confirm zero regression.

---

## 🛡️ Cross-Platform Execution Gotchas

### 1. Terminal Escape Sequences in Logs
- **Gotcha**: ANSI color codes leaking into markdown summaries or CI logs.
- **Mitigation**: Run commands with `NO_COLOR=1` or `PAGER=cat`, and strip ANSI escape sequences before writing to persistent logs.

### 2. Path Delimiters Across OS
- **Gotcha**: Hardcoded `/` or `\` in path manipulations causing failures across Linux/Windows.
- **Mitigation**: Always use `Path` from `pathlib` in Python or `path.join()` in Node.js.

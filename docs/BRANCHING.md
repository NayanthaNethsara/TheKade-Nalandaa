## Branching Strategy

We follow a simplified Git workflow:

- `main`: Production-ready code. Only merged after testing in staging.
- `develop`(dev): Active development branch. All features are merged here first
- `feature/<feature-name>`: Feature branches. Branched from `develop`, merged back via Pull
- `docs/<document-name>`: Document branches.
- `test/<test-unit>`: Test Cases
  Request.

---

**Rules:**

- All changes go through Pull Requests with code review.
- CI runs on all PRs to `dev` and `main`
- `main` is protected (no direct commits)

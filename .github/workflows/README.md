# GitHub Actions Workflows

This directory contains CI/CD workflows for TheKade-Nalandaa project.

## 📋 Available Workflows

### 1. Authentication E2E Tests (`auth-e2e-tests.yml`)

Comprehensive E2E testing for authentication flows across multiple browsers.

**Triggers:**

- Push to `dev` or `main` (auth-related files)
- Pull requests to `dev` or `main`
- Manual dispatch

**Test Matrix:**

- Browsers: Chromium, Firefox, WebKit
- Test Suites: auth.spec.ts, auth-api.spec.ts, middleware.spec.ts, auth-integration.spec.ts

**Artifacts:**

- HTML reports (30 days)
- Test results JSON/XML (30 days)
- Screenshots on failure (7 days)
- Videos on failure (7 days)

---

### 2. UI Tests (`ui-tests.yml`)

General frontend testing workflow.

**Triggers:**

- Push to `dev` or `test/**` (frontend files)
- Pull requests to `dev`
- Manual dispatch

**Features:**

- All Playwright tests
- Multiple report formats
- Test result publishing

---

### 3. Book Service Pipeline (`book-pipline.yml`)

Backend testing and deployment for BookService.

---

### 4. Auth Service Pipeline (`auth-pipeline.yml`)

Backend testing and deployment for AuthService.

---

## 🔐 Required Secrets

Configure these in GitHub repository settings:

### Authentication & API

- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `AUTH_API_BASE_URL`
- `BOOK_API_BASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

### Database & Services

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

---

## 🚀 Manual Workflow Dispatch

All workflows support manual triggering:

1. Go to **Actions** tab
2. Select workflow
3. Click **Run workflow**
4. Choose branch
5. Click **Run workflow** button

---

## 📊 Viewing Results

### In Pull Requests

- Check runs appear at bottom of PR
- Test results posted as comments
- Inline annotations for failures

### In Actions Tab

- Click workflow run
- View summary and logs
- Download artifacts
- Check job outputs

---

## 🎯 Workflow Status Badges

Add to README.md:

```markdown
![Auth E2E Tests](https://github.com/NayanthaNethsara/TheKade-Nalandaa/actions/workflows/auth-e2e-tests.yml/badge.svg)
![UI Tests](https://github.com/NayanthaNethsara/TheKade-Nalandaa/actions/workflows/ui-tests.yml/badge.svg)
```

---

## 🔧 Modifying Workflows

### Adding Test Files

Edit `auth-e2e-tests.yml`:

```yaml
- name: Run New Tests
  run: npx playwright test tests/new-test.spec.ts --project=${{ matrix.browser }}
```

### Changing Browsers

Edit matrix in `auth-e2e-tests.yml`:

```yaml
strategy:
  matrix:
    browser: [chromium, firefox] # Remove webkit
```

### Adjusting Triggers

Modify `on` section:

```yaml
on:
  push:
    branches: [dev, main, feature/**]
    paths:
      - "frontend/**"
```

---

## 📚 Documentation

- [CI/CD Testing Guide](../docs/CI_CD_TESTING.md)
- [Setup Summary](../docs/CI_CD_SETUP_SUMMARY.md)
- [Pipeline Flow](../docs/CI_CD_PIPELINE_FLOW.md)
- [Quick Reference](../docs/TESTING_QUICK_REFERENCE.md)

---

**Maintained by:** TheKade-Nalandaa Team  
**Last Updated:** October 23, 2025

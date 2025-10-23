# Test Suite

This directory contains comprehensive end-to-end tests for the TheKade-Nalandaa application using Playwright.

## 📁 Structure

```
tests/
├── auth.spec.ts                    # Main authentication flow tests
├── auth-api.spec.ts                # API endpoint tests
├── auth-integration.spec.ts        # Integration tests with helpers
├── middleware.spec.ts              # Middleware and route protection tests
├── app.spec.ts                     # Legacy tests (to be migrated)
├── AUTH_TEST_DOCUMENTATION.md      # Comprehensive test documentation
└── helpers/
    └── auth-helpers.ts             # Reusable test utilities
```

## 🧪 Test Files

### `auth.spec.ts`

Complete authentication flow tests covering:

- Login (UI, validation, errors)
- Registration (Reader & Author)
- Session management
- Protected routes
- Token expiration
- Logout
- Error handling
- Accessibility

### `auth-api.spec.ts`

API-level authentication tests:

- Registration endpoints
- NextAuth integration
- Error responses
- Security validation
- Rate limiting
- Data validation

### `middleware.spec.ts`

Middleware behavior tests:

- Route protection
- Token validation
- Redirect logic
- API route protection
- Role-based access
- Edge cases
- Performance

### `auth-integration.spec.ts`

Integration tests demonstrating helper usage:

- Full authentication flows
- Error handling
- Edge cases
- Performance benchmarks

### `helpers/auth-helpers.ts`

Reusable test utilities:

- `AuthHelpers` - Authentication operations
- `FormHelpers` - Form interactions
- `SessionHelpers` - Session management
- `NavigationHelpers` - Page navigation
- `TestDataGenerator` - Test data creation
- `AssertionHelpers` - Common assertions
- `APIHelpers` - API mocking
- `WaitHelpers` - Waiting utilities
- `AccessibilityHelpers` - A11y testing

## 🚀 Quick Start

### Run All Tests

```bash
npm test
```

### Run Specific Test File

```bash
npx playwright test tests/auth.spec.ts
npx playwright test tests/auth-api.spec.ts
npx playwright test tests/middleware.spec.ts
```

### Run Tests in UI Mode

```bash
npx playwright test --ui
```

### Run Tests in Debug Mode

```bash
npx playwright test --debug
```

### Run Tests in Headed Mode

```bash
npx playwright test --headed
```

### Run Tests for Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Tests with Specific Tag

```bash
npx playwright test --grep "@smoke"
npx playwright test --grep "@auth"
```

## 📊 View Test Reports

```bash
npx playwright show-report
```

## 🔧 Configuration

Test configuration is in `playwright.config.ts`:

- Base URL: `http://localhost:3000`
- Browsers: Chromium, Firefox, WebKit
- Retry: 2 times in CI, 0 locally
- Screenshots: On failure
- Video: On first retry
- Trace: On first retry

## ✅ Test Coverage

### Authentication Flows

- ✅ Login with valid credentials
- ✅ Login with invalid credentials
- ✅ Reader registration
- ✅ Author registration
- ✅ Form validation
- ✅ Password visibility toggle
- ✅ Error handling
- ✅ Network error handling

### API Testing

- ✅ Registration endpoints
- ✅ Email validation
- ✅ Phone number validation
- ✅ Duplicate email handling
- ✅ Error responses
- ✅ Security validation
- ✅ Input sanitization

### Middleware

- ✅ Route protection
- ✅ Public route access
- ✅ Token validation
- ✅ Redirect behavior
- ✅ API protection
- ⚠️ Role-based access (partial)
- ✅ Edge cases

### Accessibility

- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Screen reader support
- ✅ Focus management

## 🎯 Best Practices

### Writing Tests

1. **Use descriptive names**: Test names should clearly state what is tested
2. **Follow AAA pattern**: Arrange, Act, Assert
3. **Use helpers**: Leverage the helper functions for consistency
4. **Keep tests isolated**: Each test should be independent
5. **Clean up**: Ensure no side effects between tests

### Example Test Structure

```typescript
test("should login successfully with valid credentials", async ({ page }) => {
  // Arrange
  const email = "test@example.com";
  const password = "password123";
  await APIHelpers.mockSuccessfulLogin(page);

  // Act
  await NavigationHelpers.goToLogin(page);
  await FormHelpers.fillLoginForm(page, email, password);
  await FormHelpers.submitLoginForm(page);

  // Assert
  await NavigationHelpers.waitForDashboardRedirect(page);
  await AssertionHelpers.assertOnDashboard(page);
});
```

### Using Helpers

```typescript
// Instead of:
await page.goto("/login");
await page.getByPlaceholder("Enter your Email").fill(email);
await page.getByPlaceholder("••••••••").fill(password);
await page.getByRole("button", { name: /Login/i }).click();

// Use:
await NavigationHelpers.goToLogin(page);
await FormHelpers.fillLoginForm(page, email, password);
await FormHelpers.submitLoginForm(page);
```

## 🐛 Debugging Failed Tests

### Steps to Debug

1. **Check console output**: Look for error messages
2. **View screenshot**: Check `test-results/` folder
3. **Run in headed mode**: See what's happening

```bash
npx playwright test --headed --debug
```

4. **Use trace viewer**: For detailed investigation

```bash
npx playwright show-trace trace.zip
```

### Common Issues

**Test Timeout**

- Increase timeout: `test.setTimeout(60000)`
- Add explicit waits: `await page.waitForLoadState('networkidle')`

**Element Not Found**

- Check selector: Use Playwright inspector
- Wait for element: `await element.waitFor()`
- Verify page state: Ensure you're on correct page

**Flaky Tests**

- Add proper waits
- Use `waitForLoadState` and `waitForURL`
- Avoid fixed timeouts (`setTimeout`)

## 📝 Adding New Tests

### 1. Identify Test Location

- **UI flows**: `auth.spec.ts`
- **API endpoints**: `auth-api.spec.ts`
- **Middleware**: `middleware.spec.ts`
- **Integration**: `auth-integration.spec.ts`

### 2. Use Helpers

Check `helpers/auth-helpers.ts` for existing utilities

### 3. Follow Patterns

Look at existing tests for structure and style

### 4. Add Documentation

Update `AUTH_TEST_DOCUMENTATION.md` if needed

### 5. Test Locally

```bash
npx playwright test tests/your-test.spec.ts
```

## 🔄 CI/CD Integration

Tests run automatically on:

- Pull requests
- Push to main/develop
- Manual workflow dispatch

### CI Configuration

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Run Playwright tests
  run: npx playwright test

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## 📈 Test Metrics

Current test count:

- **Authentication Flow**: 15+ tests
- **API Tests**: 25+ tests
- **Middleware Tests**: 30+ tests
- **Integration Tests**: 15+ tests

**Total**: 85+ test cases

## 🔐 Test Data

### Generated Data

Tests use `TestDataGenerator` for unique data:

```typescript
const email = TestDataGenerator.generateEmail();
const readerData = TestDataGenerator.generateReaderData();
const authorData = TestDataGenerator.generateAuthorData();
```

### Cleanup

Tests clean up automatically:

- Session cookies cleared in `beforeEach`
- Unique identifiers prevent conflicts
- No shared state between tests

## 🎓 Learning Resources

- [Playwright Documentation](https://playwright.dev/)
- [Test Best Practices](https://playwright.dev/docs/best-practices)
- [AUTH_TEST_DOCUMENTATION.md](./AUTH_TEST_DOCUMENTATION.md)
- [Debugging Tests](https://playwright.dev/docs/debug)

## 🤝 Contributing

1. Write tests for new features
2. Update existing tests for changes
3. Use helper functions
4. Follow naming conventions
5. Add documentation
6. Ensure tests pass locally
7. Review test coverage

## 📞 Support

For questions or issues:

1. Check [AUTH_TEST_DOCUMENTATION.md](./AUTH_TEST_DOCUMENTATION.md)
2. Review existing test examples
3. Consult Playwright docs
4. Ask the team

## 🔮 Future Improvements

- [ ] Visual regression testing
- [ ] Load testing
- [ ] Mobile testing
- [ ] API contract testing
- [ ] Component testing
- [ ] Snapshot testing
- [ ] Test parallelization optimization
- [ ] Custom reporters
- [ ] Test data fixtures
- [ ] Cross-browser cloud testing

## 📊 Coverage Goals

- [ ] 100% critical path coverage
- [ ] 90% overall feature coverage
- [ ] All API endpoints tested
- [ ] All user flows tested
- [ ] Accessibility compliance
- [ ] Security testing

---

**Last Updated**: October 23, 2025
**Maintainers**: Development Team
**Framework**: Playwright
**Language**: TypeScript

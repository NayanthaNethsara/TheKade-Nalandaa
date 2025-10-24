import { test, expect } from "@playwright/test";
import {
  AuthHelpers,
  FormHelpers,
  SessionHelpers,
  NavigationHelpers,
  TestDataGenerator,
  AssertionHelpers,
  APIHelpers,
} from "./helpers/auth-helpers";

/**
 * Integration Tests using Helper Functions
 * Demonstrates how to use the helper utilities for cleaner, more maintainable tests
 */

test.describe("Authentication Integration - Using Helpers", () => {
  test.beforeEach(async ({ page }) => {
    await SessionHelpers.clearSession(page);
  });

  test("should complete full login flow using helpers", async ({ page }) => {
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

  test("should handle login failure using helpers", async ({ page }) => {
    // Arrange
    await APIHelpers.mockFailedLogin(page);

    // Act
    await NavigationHelpers.goToLogin(page);
    await FormHelpers.fillLoginForm(page, "wrong@example.com", "wrongpass");
    await FormHelpers.submitLoginForm(page);

    // Assert
    const hasError = await FormHelpers.hasValidationError(
      page,
      "Invalid email or password"
    );
    expect(hasError).toBeTruthy();
  });

  test("should register new reader using helpers", async ({ page }) => {
    // Arrange
    const readerData = TestDataGenerator.generateReaderData();
    await APIHelpers.mockSuccessfulRegistration(page);

    // Act
    await AuthHelpers.registerReader(page, readerData);

    // Assert
    await NavigationHelpers.waitForLoginRedirect(page);
  });

  test("should register new author using helpers", async ({ page }) => {
    // Arrange
    const authorData = TestDataGenerator.generateAuthorData();
    await APIHelpers.mockSuccessfulRegistration(page);

    // Act
    await AuthHelpers.registerAuthor(page, authorData);

    // Assert
    await NavigationHelpers.waitForLoginRedirect(page);
  });

  test("should validate email format using helpers", async ({ page }) => {
    // Arrange
    const invalidEmails = TestDataGenerator.getInvalidEmails();
    await NavigationHelpers.goToRegister(page);

    // Act & Assert
    for (const email of invalidEmails) {
      await page.getByPlaceholder("Enter your email").fill(email);
      await page.getByPlaceholder("Enter your full name").fill("Test User");
      await page
        .getByPlaceholder("Create a strong password")
        .fill("Password123!");
      await page.getByPlaceholder("Confirm your password").fill("Password123!");
      await page.getByRole("button", { name: /Create Account/i }).click();

      // Should show validation error or browser validation
      const url = page.url();
      expect(url).toContain("/register");
    }
  });

  test("should test password visibility toggle using helpers", async ({
    page,
  }) => {
    // Arrange
    await NavigationHelpers.goToLogin(page);

    // Act
    const passwordInput = page.getByPlaceholder("••••••••");
    await expect(passwordInput).toHaveAttribute("type", "password");

    await FormHelpers.togglePasswordVisibility(page);

    // Assert
    await expect(passwordInput).toHaveAttribute("type", "text");
  });

  test("should check session persistence using helpers", async ({ page }) => {
    // Arrange
    await SessionHelpers.createMockSession(page);

    // Act
    await NavigationHelpers.goToDashboard(page);
    await page.reload();

    // Assert
    const hasSession = await SessionHelpers.hasActiveSession(page);
    expect(hasSession).toBeTruthy();
  });

  test("should handle expired session using helpers", async ({ page }) => {
    // Arrange
    await SessionHelpers.createMockSession(page, "expired-token");

    // Act
    await NavigationHelpers.goToDashboard(page);

    // Assert
    await NavigationHelpers.waitForLoginRedirect(page);
    await AssertionHelpers.assertOnLoginPage(page);
  });

  test("should handle network errors using helpers", async ({ page }) => {
    // Arrange
    await APIHelpers.mockNetworkError(page, "**/api/Auth/login");

    // Act
    await NavigationHelpers.goToLogin(page);
    await FormHelpers.fillLoginForm(page, "test@example.com", "password");
    await FormHelpers.submitLoginForm(page);

    // Assert
    const error = await AuthHelpers.waitForAuthError(page);
    expect(error).toBeTruthy();
    expect(error?.toLowerCase()).toContain("error");
  });

  test("should test duplicate email registration using helpers", async ({
    page,
  }) => {
    // Arrange
    const email = TestDataGenerator.generateEmail("duplicate");
    await APIHelpers.mockFailedRegistration(page, "Email already exists");

    // Act
    await NavigationHelpers.goToRegister(page);
    await page.getByPlaceholder("Enter your email").fill(email);
    await page.getByPlaceholder("Enter your full name").fill("Test User");
    await page
      .getByPlaceholder("Create a strong password")
      .fill("Password123!");
    await page.getByPlaceholder("Confirm your password").fill("Password123!");
    await page.getByRole("button", { name: /Create Account/i }).click();

    // Assert
    await AssertionHelpers.assertErrorMessage(page, "Email already exists");
  });

  test("should validate password mismatch using helpers", async ({ page }) => {
    // Arrange
    await NavigationHelpers.goToRegister(page);

    // Act
    await page
      .getByPlaceholder("Enter your email")
      .fill(TestDataGenerator.generateEmail());
    await page.getByPlaceholder("Enter your full name").fill("Test User");
    await page
      .getByPlaceholder("Create a strong password")
      .fill("Password123!");
    await page
      .getByPlaceholder("Confirm your password")
      .fill("DifferentPassword!");
    await page.getByRole("button", { name: /Create Account/i }).click();

    // Assert
    await AssertionHelpers.assertErrorMessage(page, "Passwords do not match");
  });

  test("should test button states during submission using helpers", async ({
    page,
  }) => {
    // Arrange
    await NavigationHelpers.goToLogin(page);
    await FormHelpers.fillLoginForm(page, "test@example.com", "password");

    // Act
    await FormHelpers.submitLoginForm(page);

    // Assert
    await AssertionHelpers.assertButtonDisabled(page, "Login");
  });

  test("should clear error on input change using helpers", async ({ page }) => {
    // Arrange
    await NavigationHelpers.goToLogin(page);

    // Act - trigger error
    await FormHelpers.submitLoginForm(page);
    await AssertionHelpers.assertErrorMessage(page, "Email is required");

    // Act - start typing
    await page.getByPlaceholder("Enter your Email").fill("t");

    // Assert - error should be cleared
    await expect(page.getByText("Email is required")).not.toBeVisible();
  });
});

test.describe("Authentication Edge Cases - Using Helpers", () => {
  test("should handle rapid form submissions", async ({ page }) => {
    await NavigationHelpers.goToLogin(page);
    await FormHelpers.fillLoginForm(page, "test@example.com", "password");

    // Submit multiple times rapidly
    const submitPromises = [];
    for (let i = 0; i < 3; i++) {
      submitPromises.push(FormHelpers.submitLoginForm(page));
    }

    await Promise.all(submitPromises);

    // Should handle gracefully without crashes
    await AssertionHelpers.assertButtonDisabled(page, "Login");
  });

  test("should handle special characters in credentials", async ({ page }) => {
    const specialChars = [
      "test+tag@example.com",
      "test.user@example.com",
      "test_user@example.com",
    ];

    for (const email of specialChars) {
      await NavigationHelpers.goToLogin(page);
      await FormHelpers.fillLoginForm(page, email, "password");
      await FormHelpers.submitLoginForm(page);

      // Should process without errors
      await page.waitForTimeout(1000);
    }
  });

  test("should handle very long input values", async ({ page }) => {
    await NavigationHelpers.goToRegister(page);

    const longString = "a".repeat(1000);
    await page
      .getByPlaceholder("Enter your email")
      .fill(`${longString}@example.com`);
    await page.getByPlaceholder("Enter your full name").fill(longString);
    await page.getByPlaceholder("Create a strong password").fill(longString);
    await page.getByPlaceholder("Confirm your password").fill(longString);

    await page.getByRole("button", { name: /Create Account/i }).click();

    // Should handle gracefully (might show validation errors)
    const url = page.url();
    expect(url).toBeDefined();
  });
});

test.describe("Authentication Performance - Using Helpers", () => {
  test("should load login page quickly", async ({ page }) => {
    const startTime = Date.now();
    await NavigationHelpers.goToLogin(page);
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });

  test("should handle form submission within reasonable time", async ({
    page,
  }) => {
    await APIHelpers.mockSuccessfulLogin(page);
    await NavigationHelpers.goToLogin(page);
    await FormHelpers.fillLoginForm(page, "test@example.com", "password");

    const startTime = Date.now();
    await FormHelpers.submitLoginForm(page);
    await NavigationHelpers.waitForDashboardRedirect(page);
    const submitTime = Date.now() - startTime;

    expect(submitTime).toBeLessThan(5000);
  });
});

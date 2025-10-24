import { Page, expect } from "@playwright/test";

/**
 * Test Helpers for Authentication Tests
 * Common utilities and helper functions used across test suites
 */

/**
 * Authentication Helper Functions
 */
export class AuthHelpers {
  /**
   * Perform login with credentials
   */
  static async login(
    page: Page,
    email: string,
    password: string
  ): Promise<void> {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    await page.getByPlaceholder("Enter your Email").fill(email);
    await page.getByPlaceholder("••••••••").fill(password);
    await page.getByRole("button", { name: /Login/i }).click();
  }

  /**
   * Perform reader registration
   */
  static async registerReader(
    page: Page,
    data: {
      email: string;
      name: string;
      password: string;
    }
  ): Promise<void> {
    await page.goto("/register");
    await page.waitForLoadState("networkidle");

    // Ensure Reader is selected
    await page.getByRole("button", { name: /Reader/i }).click();

    await page.getByPlaceholder("Enter your email").fill(data.email);
    await page.getByPlaceholder("Enter your full name").fill(data.name);
    await page.getByPlaceholder("Create a strong password").fill(data.password);
    await page.getByPlaceholder("Confirm your password").fill(data.password);

    await page.getByRole("button", { name: /Create Account/i }).click();
  }

  /**
   * Perform author registration
   */
  static async registerAuthor(
    page: Page,
    data: {
      email: string;
      name: string;
      password: string;
      nic: string;
      phone: string;
    }
  ): Promise<void> {
    await page.goto("/register");
    await page.waitForLoadState("networkidle");

    // Select Author
    await page.getByRole("button", { name: /Author/i }).click();

    await page.getByPlaceholder("Enter your email").fill(data.email);
    await page.getByPlaceholder("Enter your full name").fill(data.name);
    await page.getByPlaceholder("Enter your NIC number").fill(data.nic);
    await page.getByPlaceholder("Enter your phone number").fill(data.phone);
    await page.getByPlaceholder("Create a strong password").fill(data.password);
    await page.getByPlaceholder("Confirm your password").fill(data.password);

    await page.getByRole("button", { name: /Create Account/i }).click();
  }

  /**
   * Logout user
   */
  static async logout(page: Page): Promise<void> {
    // Adjust selector based on your actual logout implementation
    await page.getByRole("button", { name: /logout/i }).click();
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(page: Page): Promise<boolean> {
    try {
      await page.waitForURL("/dashboard", { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for authentication error
   */
  static async waitForAuthError(page: Page): Promise<string | null> {
    try {
      const errorElement = page.locator(
        '[class*="bg-red"], [class*="text-red"]'
      );
      await errorElement.waitFor({ timeout: 5000 });
      return await errorElement.textContent();
    } catch {
      return null;
    }
  }
}

/**
 * Form Validation Helpers
 */
export class FormHelpers {
  /**
   * Fill login form
   */
  static async fillLoginForm(
    page: Page,
    email: string,
    password: string
  ): Promise<void> {
    await page.getByPlaceholder("Enter your Email").fill(email);
    await page.getByPlaceholder("••••••••").fill(password);
  }

  /**
   * Submit login form
   */
  static async submitLoginForm(page: Page): Promise<void> {
    await page.getByRole("button", { name: /Login/i }).click();
  }

  /**
   * Check for validation error
   */
  static async hasValidationError(
    page: Page,
    errorText: string
  ): Promise<boolean> {
    try {
      await expect(page.getByText(errorText)).toBeVisible({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Toggle password visibility
   */
  static async togglePasswordVisibility(page: Page): Promise<void> {
    await page.locator('[data-testid="toggle-password"]').first().click();
  }
}

/**
 * Session and Cookie Helpers
 */
export class SessionHelpers {
  /**
   * Create mock session
   */
  static async createMockSession(page: Page, token?: string): Promise<void> {
    await page.context().addCookies([
      {
        name: "next-auth.session-token",
        value: token || "mock-session-token",
        domain: "localhost",
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
      },
    ]);
  }

  /**
   * Clear all session cookies
   */
  static async clearSession(page: Page): Promise<void> {
    await page.context().clearCookies();
  }

  /**
   * Get session cookie
   */
  static async getSessionCookie(
    page: Page
  ): Promise<{ name: string; value: string } | null> {
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(
      (c) => c.name === "next-auth.session-token"
    );
    return sessionCookie || null;
  }

  /**
   * Check if session exists
   */
  static async hasActiveSession(page: Page): Promise<boolean> {
    const cookie = await this.getSessionCookie(page);
    return cookie !== null;
  }
}

/**
 * Navigation Helpers
 */
export class NavigationHelpers {
  /**
   * Navigate to login page
   */
  static async goToLogin(page: Page): Promise<void> {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
  }

  /**
   * Navigate to register page
   */
  static async goToRegister(page: Page): Promise<void> {
    await page.goto("/register");
    await page.waitForLoadState("networkidle");
  }

  /**
   * Navigate to dashboard
   */
  static async goToDashboard(page: Page): Promise<void> {
    await page.goto("/dashboard");
  }

  /**
   * Wait for redirect to login
   */
  static async waitForLoginRedirect(page: Page): Promise<void> {
    await page.waitForURL("/login", { timeout: 10000 });
  }

  /**
   * Wait for redirect to dashboard
   */
  static async waitForDashboardRedirect(page: Page): Promise<void> {
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
  }
}

/**
 * Test Data Generators
 */
export class TestDataGenerator {
  /**
   * Generate unique email
   */
  static generateEmail(prefix = "test"): string {
    return `${prefix}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}@example.com`;
  }

  /**
   * Generate test user data for reader
   */
  static generateReaderData() {
    return {
      email: this.generateEmail("reader"),
      name: `Test Reader ${Date.now()}`,
      password: "SecurePassword123!",
      role: "READER" as const,
    };
  }

  /**
   * Generate test user data for author
   */
  static generateAuthorData() {
    return {
      email: this.generateEmail("author"),
      name: `Test Author ${Date.now()}`,
      password: "SecurePassword123!",
      nic: `${Math.floor(Math.random() * 1000000000)}V`,
      phone: `077${Math.floor(Math.random() * 10000000)}`,
      role: "AUTHOR" as const,
    };
  }

  /**
   * Generate invalid email formats
   */
  static getInvalidEmails(): string[] {
    return [
      "invalid-email",
      "missing@domain",
      "@nodomain.com",
      "spaces in@email.com",
      "double@@domain.com",
    ];
  }

  /**
   * Generate weak passwords
   */
  static getWeakPasswords(): string[] {
    return ["123", "password", "abc", "12345678", "qwerty"];
  }

  /**
   * Generate invalid phone numbers
   */
  static getInvalidPhones(): string[] {
    return ["123", "abc", "0123456", "99912345678", "invalid"];
  }
}

/**
 * Assertion Helpers
 */
export class AssertionHelpers {
  /**
   * Assert user is on login page
   */
  static async assertOnLoginPage(page: Page): Promise<void> {
    await expect(page).toHaveURL("/login");
    await expect(page.getByText("Nalandaa - TheKade")).toBeVisible();
  }

  /**
   * Assert user is on dashboard
   */
  static async assertOnDashboard(page: Page): Promise<void> {
    await expect(page).toHaveURL(/\/dashboard/);
  }

  /**
   * Assert error message is displayed
   */
  static async assertErrorMessage(page: Page, message: string): Promise<void> {
    await expect(page.getByText(message)).toBeVisible();
  }

  /**
   * Assert form field has error
   */
  static async assertFieldError(page: Page, fieldName: string): Promise<void> {
    const field = page.getByPlaceholder(new RegExp(fieldName, "i"));
    await expect(field).toHaveAttribute("aria-invalid", "true");
  }

  /**
   * Assert button is disabled
   */
  static async assertButtonDisabled(
    page: Page,
    buttonText: string
  ): Promise<void> {
    const button = page.getByRole("button", {
      name: new RegExp(buttonText, "i"),
    });
    await expect(button).toBeDisabled();
  }

  /**
   * Assert button is enabled
   */
  static async assertButtonEnabled(
    page: Page,
    buttonText: string
  ): Promise<void> {
    const button = page.getByRole("button", {
      name: new RegExp(buttonText, "i"),
    });
    await expect(button).toBeEnabled();
  }
}

/**
 * API Mock Helpers
 */
export class APIHelpers {
  /**
   * Mock successful login
   */
  static async mockSuccessfulLogin(page: Page): Promise<void> {
    await page.route("**/api/Auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          token: "mock-jwt-token",
        }),
      });
    });
  }

  /**
   * Mock failed login
   */
  static async mockFailedLogin(page: Page): Promise<void> {
    await page.route("**/api/Auth/login", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Invalid credentials",
        }),
      });
    });
  }

  /**
   * Mock successful registration
   */
  static async mockSuccessfulRegistration(page: Page): Promise<void> {
    await page.route("**/api/auth/register", async (route) => {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          message: "User registered successfully",
          user: { id: 1, email: "test@example.com" },
        }),
      });
    });
  }

  /**
   * Mock failed registration
   */
  static async mockFailedRegistration(
    page: Page,
    errorMessage: string
  ): Promise<void> {
    await page.route("**/api/auth/register", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          error: errorMessage,
        }),
      });
    });
  }

  /**
   * Mock network error
   */
  static async mockNetworkError(page: Page, url: string): Promise<void> {
    await page.route(url, (route) => route.abort());
  }
}

/**
 * Wait Helpers
 */
export class WaitHelpers {
  /**
   * Wait for loading to complete
   */
  static async waitForLoading(page: Page): Promise<void> {
    await page.waitForLoadState("networkidle");
  }

  /**
   * Wait for API call
   */
  static async waitForAPICall(page: Page, url: string): Promise<void> {
    await page.waitForResponse((response) => response.url().includes(url));
  }

  /**
   * Wait for element to be visible
   */
  static async waitForElement(page: Page, selector: string): Promise<void> {
    await page.locator(selector).waitFor({ state: "visible" });
  }

  /**
   * Wait for navigation
   */
  static async waitForNavigation(page: Page, url: string): Promise<void> {
    await page.waitForURL(url);
  }
}

/**
 * Accessibility Helpers
 */
export class AccessibilityHelpers {
  /**
   * Check keyboard navigation
   */
  static async testKeyboardNavigation(page: Page): Promise<void> {
    await page.keyboard.press("Tab");
  }

  /**
   * Check ARIA labels
   */
  static async hasARIALabel(page: Page, selector: string): Promise<boolean> {
    const element = page.locator(selector);
    const ariaLabel = await element.getAttribute("aria-label");
    return ariaLabel !== null;
  }

  /**
   * Check for focus visible
   */
  static async isFocusVisible(page: Page, selector: string): Promise<boolean> {
    const element = page.locator(selector);
    return await element.evaluate((el) => {
      return document.activeElement === el;
    });
  }
}

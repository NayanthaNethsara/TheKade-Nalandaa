import { test as base, expect } from "@playwright/test";

// Setup error handling and monitoring
const test = base.extend({
  page: async ({ page }, runTest) => {
    // Add event listener for console errors
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.error(`Page error: ${msg.text()}`);
      }
    });

    // Add event listener for uncaught errors
    page.on("pageerror", (error) => {
      console.error(`Uncaught error: ${error.message}`);
    });

    await runTest(page);
  },
});

test.describe("Authentication Flow", () => {
  test("should redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/login");
  });

  test("should display login page elements", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");

    // Check for branding elements
    const title = page.getByText("Nalandaa - TheKade");
    const description = page.getByText("Access your favorite books");

    await expect(title).toBeVisible();
    await expect(description).toBeVisible();

    // Check for form elements
    const emailInput = page.getByPlaceholder("Enter your Email");
    const passwordInput = page.getByPlaceholder("••••••••");

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test("should handle form submission", async ({ page }) => {
    await page.goto("/login");
    // Wait for the page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Submit empty form
    const loginButton = page.getByRole("button", { name: /Login/i });
    await loginButton.click();

    // Check for error alert
    const alert = page
      .locator("div")
      .filter({ hasText: "Username is required" });
    await expect(alert).toBeVisible();
  });

  test("should check email field", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    // Get the login button
    const loginButton = page.getByRole("button", { name: /Login/i });

    // Check that button exists and is enabled
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();

    // Get email field and check it exists
    const emailInput = page.getByPlaceholder("Enter your email");
    await expect(emailInput).toBeVisible();
  });
});

test.describe("Layout Structure", () => {
  test("should have basic layout elements", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");

    // Check for layout elements
    const gradientLine = page.locator("div.h-1.w-16");
    const title = page.getByText("Nalandaa - TheKade");
    const description = page.getByText("Access your favorite books");

    await expect(gradientLine).toBeVisible();
    await expect(title).toBeVisible();
    await expect(description).toBeVisible();
  });
});

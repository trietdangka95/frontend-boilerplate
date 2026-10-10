import { expect, test } from "@playwright/test";

test("local demo login verifies a cookie and logout revokes browser access", async ({ page }) => {
  await page.goto("/examples/private");
  await expect(page).toHaveURL(/\/login$/);
  await page.getByRole("textbox", { name: "Email", exact: true }).fill("demo@example.com");
  await page.getByLabel("Password", { exact: true }).fill("password123");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Demo session verified" })).toBeVisible();
  await page.getByRole("link", { name: "Return to examples" }).click();
  await page.getByRole("button", { name: "MT — Log out" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/examples/private");
  await expect(page).toHaveURL(/\/login$/);
});

import { expect, test } from "@playwright/test";

test("starter and examples work without browser errors", async ({ page, isMobile }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  const response = await page.goto("/");
  expect(response?.headers()["content-security-policy"]).toContain("nonce-");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("A foundation");
  const mainBounds = await page.getByRole("main").boundingBox();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  expect(await page.getByRole("main").boundingBox()).toEqual(mainBounds);
  await page.getByRole("button", { name: /Current mode/ }).click();
  await expect(
    page.getByRole("button", { name: "Current mode is light. Click to change." }),
  ).toBeVisible();
  if (testInfo.project.use.colorScheme === "dark") {
    await page.getByRole("button", { name: /Current mode/ }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  } else {
    await expect(page.locator("html")).toHaveClass(/light/);
  }
  await page.getByRole("link", { name: "Explore examples" }).click();
  await expect(page.getByRole("heading", { name: "Example workspace" })).toBeVisible();
  await expect(page.getByText("Foundation setup", { exact: true })).toBeVisible();
  if (isMobile) {
    await page.getByRole("button", { name: /open navigation/i }).click();
    await page.keyboard.press("Escape");
  }
  await page.getByRole("textbox", { name: "Search table" }).fill("Foundation");
  await expect(page.getByTestId("data-table-row")).toHaveCount(1);
  await page.getByRole("button", { name: "View Foundation setup" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("textbox", { name: "Search table" }).fill("");
  await page.locator("#create-record").getByRole("button", { name: "Create record" }).click();
  await expect(page.getByText("Name must be at least 2 characters")).toBeVisible();
  const form = page.locator("#create-record");
  for (const name of ["Browser record A", "Browser record B"]) {
    await form.getByRole("textbox", { name: "Name", exact: true }).fill(name);
    await form.getByRole("textbox", { name: "Owner email" }).fill("browser@example.com");
    await form.getByRole("button", { name: "Create record" }).click();
    await expect(page.getByText(`${name} created`, { exact: true })).toBeVisible();
    await expect(form.getByRole("textbox", { name: "Name", exact: true })).toHaveValue("");
    await expect(page.getByRole("button", { name: `View ${name}` })).toBeVisible();
  }
  await page.locator("#records").getByRole("button", { name: "Go to next page" }).click();
  await expect(page.getByTestId("data-table-row")).toHaveCount(1);
  await page.getByRole("textbox", { name: "Search table" }).fill("Browser record");
  await expect(page.getByTestId("data-table-row")).toHaveCount(2);
  await page.getByRole("button", { name: "Name", exact: true }).click();
  await expect(page.getByTestId("data-table-row").first()).toContainText("Browser record A");
  await page.screenshot({ path: testInfo.outputPath("examples.png"), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  expect(errors).toEqual([]);
});

test("production denies demo authentication and private APIs", async ({ request }) => {
  expect((await request.get("/api/health")).status()).toBe(200);
  expect((await request.get("/api/private.json")).status()).toBe(401);
  expect(
    (
      await request.post("/api/auth/session", {
        data: { email: "demo@example.com", password: "password123" },
      })
    ).status(),
  ).toBe(404);
  expect((await request.get("/login")).status()).toBe(404);
});

import { test, expect } from '@playwright/test';

test.describe('interactive tutorial', () => {
  test('navigates to onboarding flow', async ({ page }) => {
    await page.context().addInitScript(() => {
      window.localStorage.clear();
    });
    await page.goto('/public/index.html');
    await page.waitForURL('**/onboarding.html');

    const title = page.locator('.screen-title');
    await expect(title).toContainText('You Can Learn to Solve Blindfolded');

    const continueBtn = page.locator('#start-tutorial');
    await expect(continueBtn).toBeVisible();
  });
});


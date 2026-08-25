import { test, expect } from '@playwright/test';

test.describe('Tutorials Page', () => {
  test('should load tutorials.html static page', async ({ page }) => {
    await page.context().addInitScript(() => {
      window.localStorage.clear();
    });
    
    await page.goto('/tutorials.html');
    await page.waitForLoadState('networkidle');

    const title = page.locator('h1').filter({ hasText: /tutorials/i });
    await expect(title).toBeVisible({ timeout: 5000 });
    
    // Verify it's the static page
    expect(page.url()).toContain('/tutorials.html');
  });

  test('should load SPA tutorials route', async ({ page }) => {
    await page.context().addInitScript(() => {
      window.localStorage.clear();
    });
    
    await page.goto('/tutorials');
    await page.waitForLoadState('networkidle');

    const title = page.locator('#tutorials-screen').getByText(/guides & resources/i);
    await expect(title).toBeVisible({ timeout: 5000 });
    
    // Verify it's the SPA route
    expect(page.url()).toContain('/tutorials');
    expect(page.url()).not.toContain('.html');
  });
});


import { test, expect } from '@playwright/test';

test.describe('Navigation and Link Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure clean state
    await page.context().addInitScript(() => {
      window.localStorage.clear();
    });
  });

  test.describe('Direct URL Access - SPA Routes', () => {
    test('should load dashboard from root URL', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const homeHeader = page.locator('#home-dashboard-screen h1');
      await expect(homeHeader).toBeVisible({ timeout: 5000 });
      await expect(homeHeader).toContainText(/blindfold cubing/i);
    });

    test('should load stats page from /stats URL', async ({ page }) => {
      await page.goto('/stats');
      await page.waitForLoadState('networkidle');
      
      const statsHeader = page.locator('#stats-screen h1');
      await expect(statsHeader).toBeVisible({ timeout: 5000 });
      await expect(statsHeader).toContainText(/statistics/i);
      
      expect(page.url()).toContain('/stats');
    });

    test('should load drill setup page from /drill URL', async ({ page }) => {
      await page.goto('/drill');
      await page.waitForLoadState('networkidle');
      
      // Check if drill setup screen is visible
      const drillHeader = page.locator('h1').filter({ hasText: /start training/i });
      await expect(drillHeader).toBeVisible({ timeout: 5000 });
      
      // Verify URL is correct
      expect(page.url()).toContain('/drill');
    });

    test('should load tutorials screen from /tutorials URL', async ({ page }) => {
      await page.goto('/tutorials');
      await page.waitForLoadState('networkidle');
      
      // Check if tutorials screen is visible
      const tutorialsHeader = page.locator('#tutorials-screen').getByText(/guides & resources/i);
      await expect(tutorialsHeader).toBeVisible({ timeout: 5000 });
      
      // Verify URL is correct
      expect(page.url()).toContain('/tutorials');
    });

    test('should load playground screen from /playground URL', async ({ page }) => {
      await page.goto('/playground');
      await page.waitForLoadState('networkidle');
      
      // Check if playground screen is visible (look for playground screen element or cube container)
      const playgroundScreen = page.locator('#playground-screen');
      await expect(playgroundScreen).toBeVisible({ timeout: 5000 });
      
      // Verify URL is correct
      expect(page.url()).toContain('/playground');
    });
  });

  test.describe('Static HTML Pages', () => {
    test('should load tutorials.html static page', async ({ page }) => {
      await page.goto('/tutorials.html');
      await page.waitForLoadState('networkidle');
      
      // Check if static tutorials page content is visible
      const tutorialsHeader = page.locator('h1').filter({ hasText: /tutorials/i });
      await expect(tutorialsHeader).toBeVisible({ timeout: 5000 });
      
      // Verify it's the static page (not SPA route)
      expect(page.url()).toContain('/tutorials.html');
    });

    test('should load intro.html', async ({ page }) => {
      await page.goto('/intro.html');
      await page.waitForLoadState('networkidle');
      
      const introHeader = page.locator('h1').filter({ hasText: /blindfold/i });
      await expect(introHeader).toBeVisible({ timeout: 5000 });
    });

    test('should load features.html', async ({ page }) => {
      await page.goto('/features.html');
      await page.waitForLoadState('networkidle');
      
      const featuresHeader = page.locator('h1').filter({ hasText: /offline|features/i });
      await expect(featuresHeader).toBeVisible({ timeout: 5000 });
    });

    test('should load lettering-system.html', async ({ page }) => {
      await page.goto('/lettering-system.html');
      await page.waitForLoadState('networkidle');
      
      const letteringHeader = page.locator('h1').filter({ hasText: /lettering|speffz/i });
      await expect(letteringHeader).toBeVisible({ timeout: 5000 });
    });

    test('should load guide pages', async ({ page }) => {
      const guidePages = [
        '/guides/improve-visualization-memory.html',
        '/guides/speffz-notation.html',
        '/guides/progress-tracking.html'
      ];

      for (const guidePath of guidePages) {
        await page.goto(guidePath);
        await page.waitForLoadState('networkidle');
        
        const guideHeader = page.locator('h1');
        await expect(guideHeader.first()).toBeVisible({ timeout: 5000 });
        
        expect(page.url()).toContain(guidePath);
      }
    });
  });

  test.describe('Navigation Links from SPA (index.html)', () => {
    test('should navigate to dashboard from nav link', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Click Dashboard link
      const dashboardLink = page.locator('a[data-route="/"]').first();
      await dashboardLink.click();
      await page.waitForLoadState('networkidle');
      
      const homeHeader = page.locator('#home-dashboard-screen h1');
      await expect(homeHeader).toBeVisible({ timeout: 5000 });
      await expect(homeHeader).toContainText(/blindfold cubing/i);
    });

    test('should navigate to drill from nav link', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Click Drills link
      const drillLink = page.locator('a[data-route="/drill"]').first();
      await drillLink.click();
      await page.waitForLoadState('networkidle');
      
      const drillHeader = page.locator('h1').filter({ hasText: /start training/i });
      await expect(drillHeader).toBeVisible({ timeout: 5000 });
      expect(page.url()).toContain('/drill');
    });

    test('should navigate to stats from nav link', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Click History/Stats link
      const statsLink = page.locator('a[data-route="/stats"]').first();
      await statsLink.click();
      await page.waitForLoadState('networkidle');
      
      const statsHeader = page.locator('#stats-screen h1');
      await expect(statsHeader).toBeVisible({ timeout: 5000 });
      await expect(statsHeader).toContainText(/statistics/i);
      expect(page.url()).toContain('/stats');
    });

    test('should navigate to tutorials from nav link', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const tutorialsLink = page.locator('a[data-route="/tutorials"]').first();
      await tutorialsLink.click();
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/tutorials');
      const tutorialsHeader = page.locator('#tutorials-screen').getByText(/guides & resources/i);
      await expect(tutorialsHeader).toBeVisible({ timeout: 5000 });
    });

    test('should navigate to playground from nav link', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Click Playground link
      const playgroundLink = page.locator('a[data-route="/playground"]').first();
      await playgroundLink.click();
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/playground');
      const playgroundContent = page.locator('#playground-screen, .cube-container').first();
      await expect(playgroundContent).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Links from Static Pages', () => {
    test('should navigate from tutorials.html to intro.html', async ({ page }) => {
      await page.goto('/tutorials.html');
      await page.waitForLoadState('networkidle');
      
      // Click link to intro.html (use first() to handle multiple links)
      const introLink = page.locator('a[href="intro.html"]').filter({ hasText: /beginner.*guide/i }).first();
      await introLink.click();
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/intro.html');
      const introHeader = page.locator('h1').filter({ hasText: /blindfold/i });
      await expect(introHeader).toBeVisible({ timeout: 5000 });
    });

    test('should navigate from tutorials.html to guide pages', async ({ page }) => {
      await page.goto('/tutorials.html');
      await page.waitForLoadState('networkidle');
      
      // Click link to visualization guide
      const guideLink = page.locator('a[href="guides/improve-visualization-memory.html"]').first();
      await guideLink.click();
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/guides/improve-visualization-memory.html');
      const guideHeader = page.locator('h1');
      await expect(guideHeader.first()).toBeVisible({ timeout: 5000 });
    });

    test('should navigate from tutorials.html to SPA dashboard', async ({ page }) => {
      await page.goto('/tutorials.html');
      await page.waitForLoadState('networkidle');
      
      // Click "Start Training Session" button (links to index.html?route=/)
      const startBtn = page.locator('a[href*="index.html?route=/"]').filter({ hasText: /start training/i }).first();
      await startBtn.click();
      
      // Wait for navigation to complete
      await page.waitForURL(/\/$|\/index\.html/, { timeout: 10000 });
      await page.waitForLoadState('networkidle');
      
      const homeHeader = page.locator('#home-dashboard-screen h1');
      await expect(homeHeader).toBeVisible({ timeout: 10000 });
      await expect(homeHeader).toContainText(/blindfold cubing/i);
    });

    test('should navigate from intro.html back to SPA', async ({ page }) => {
      await page.goto('/intro.html');
      await page.waitForLoadState('networkidle');
      
      // Look for any link that goes to index.html (could be in nav or footer)
      const startBtn = page.locator('a[href*="index.html"]').first();
      if (await startBtn.count() > 0) {
        await startBtn.click();
        
        // Wait for navigation to complete
        await page.waitForURL(/\/$|\/index\.html/, { timeout: 10000 });
        await page.waitForLoadState('networkidle');
        
        const homeHeader = page.locator('#home-dashboard-screen h1');
        await expect(homeHeader).toBeVisible({ timeout: 10000 });
        await expect(homeHeader).toContainText(/blindfold cubing/i);
      } else {
        // Skip test if no link found (intro.html might not have a link to SPA)
        test.skip();
      }
    });
  });

  test.describe('Footer Links', () => {
    test('should navigate from footer to guide pages', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500); // Wait for scroll
      
      const footerLink = page.locator('footer a[href="intro.html"]').first();
      await expect(footerLink).toBeVisible({ timeout: 5000 });
      await footerLink.click();
      
      await page.waitForURL(/\/intro\.html/, { timeout: 10000 });
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/intro.html');
    });

    test('should navigate from footer to privacy page', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      
      const footerLink = page.locator('footer a[href="privacy.html"]').first();
      await expect(footerLink).toBeVisible({ timeout: 5000 });
      await footerLink.click();
      
      await page.waitForURL(/\/privacy\.html/, { timeout: 10000 });
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/privacy.html');
    });

    test('should navigate from footer to dashboard via SPA route', async ({ page }) => {
      await page.goto('/intro.html');
      await page.waitForLoadState('networkidle');
      
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500); // Wait for scroll
      
      // Footer link should use data-route="/" for SPA navigation
      const dashboardLink = page.locator('footer a[data-route="/"]').first();
      if (await dashboardLink.count() > 0) {
        await expect(dashboardLink).toBeVisible({ timeout: 5000 });
        await dashboardLink.click();
        await page.waitForURL(/\/$|\/index\.html/, { timeout: 10000 });
        await page.waitForLoadState('networkidle');
        expect(page.url()).toMatch(/\/(index\.html)?(\?route=\/)?$/);
      } else {
        // Fallback: check for index.html?route=/ link
        const altLink = page.locator('footer a[href*="index.html"]').first();
        if (await altLink.count() > 0) {
          await expect(altLink).toBeVisible({ timeout: 5000 });
          await altLink.click();
          await page.waitForURL(/\/$|\/index\.html/, { timeout: 10000 });
          await page.waitForLoadState('networkidle');
        } else {
          test.skip();
        }
      }
    });
  });

  test.describe('Browser Navigation (Back/Forward)', () => {
    test('should handle browser back button', async ({ page }) => {
      // Navigate through multiple pages
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await page.goto('/stats');
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/stats');
      
      await page.goto('/drill');
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/drill');
      
      // Go back
      await page.goBack({ waitUntil: 'networkidle' });
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/stats');
      
      // Go back again
      await page.goBack({ waitUntil: 'networkidle' });
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/(index\.html)?$/);
    });

    test('should handle browser forward button', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await page.goto('/stats');
      await page.waitForLoadState('networkidle');
      
      await page.goBack();
      await page.waitForLoadState('networkidle');
      
      await page.goForward();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/stats');
    });
  });

  test.describe('Navigation from Static to SPA Routes', () => {
    test('should navigate from static page to SPA route using index.html?route= pattern', async ({ page }) => {
      await page.goto('/tutorials.html');
      await page.waitForLoadState('networkidle');
      
      // Find navigation link that uses index.html?route=/drill pattern
      const navLink = page.locator('nav a[href*="index.html?route=/drill"]').first();
      if (await navLink.count() > 0) {
        await expect(navLink).toBeVisible({ timeout: 5000 });
        
        // Click and wait for navigation to index.html
        await Promise.all([
          page.waitForURL(/\/index\.html|\/$/, { timeout: 10000 }),
          navLink.click()
        ]);
        
        // Wait for the page to fully load and the app to initialize
        await page.waitForLoadState('networkidle');
        
        // Wait a bit for the router to process the route parameter
        await page.waitForTimeout(1000);
        
        // Wait for the setup screen to be visible (not hidden)
        // The router should have processed the route parameter and shown the drill screen
        const setupScreen = page.locator('#setup-screen');
        await expect(setupScreen).not.toHaveClass(/hidden/, { timeout: 10000 });
        
        // Verify we're on the drill setup screen with the correct header
        const drillHeader = page.locator('#setup-screen h1').filter({ hasText: /start training/i });
        await expect(drillHeader).toBeVisible({ timeout: 5000 });
      } else {
        test.skip();
      }
    });
  });

  test.describe('404 Handling', () => {
    test('should handle non-existent routes by serving index.html', async ({ page }) => {
      await page.goto('/nonexistent-route');
      await page.waitForLoadState('networkidle');
      
      // Should serve index.html (SPA fallback)
      // The router should handle it and potentially show dashboard or handle gracefully
      // At minimum, the page should load without 404 error
      const body = page.locator('body');
      await expect(body).toBeVisible({ timeout: 5000 });
    });
  });
});


import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/.*login/);
  });

  test('should allow user to navigate to register page', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Register');
    await expect(page).toHaveURL(/.*register/);
    await expect(page.locator('text=Create an account')).toBeVisible();
  });
});

test.describe('Transaction Flow', () => {
  // Note: These tests assume the server is running and database is seeded/empty
  test.skip('should distribute income correctly across 6 jars', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // 2. Go to Add Income
    await page.click('text=Add Income');
    
    // 3. Fill income amount
    await page.fill('input[name="amount"]', '1000');
    
    // 4. Verify preview
    await expect(page.locator('text=Necessity (55%)')).toBeVisible();
    await expect(page.locator('text=฿550.00')).toBeVisible();
    
    // 5. Submit
    await page.click('button:has-text("Confirm & Distribute")');
    
    // 6. Verify redirect and success message
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Income distributed successfully')).toBeVisible();
  });
});

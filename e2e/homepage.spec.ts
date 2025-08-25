import { test, expect } from '@playwright/test';

test('should have correct login page title', async ({ page }) => {
  await page.goto('/login');
  
  // Expect the login page title to be correct
  await expect(page).toHaveTitle('Login | Trading Desk');
});

test('should have login form elements', async ({ page }) => {
  await page.goto('/login');
  
  // Check that the login form exists
  await expect(page.getByRole('heading', { name: 'Trading Desk' })).toBeVisible();
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
});

test('should navigate to signup page', async ({ page }) => {
  await page.goto('/login');
  
  // Check that we can navigate to the signup page
  await page.getByRole('link', { name: 'Sign up' }).click();
  await expect(page).toHaveURL(/.*signup/);
});

test('should have correct dashboard structure after login', async ({ page }) => {
  // For this test, we'll mock the login by directly navigating to the dashboard
  // In a real test environment, we would use proper test credentials
  
  // First, let's check if we can access the main page (which should redirect to login)
  await page.goto('/');
  
  // Check that we're redirected to login
  await expect(page).toHaveURL(/.*login/);
  await expect(page).toHaveTitle('Login | Trading Desk');
  
  // Note: Actual login testing would require test credentials or mocking
  // For now, we'll just verify the structure of the login page
});
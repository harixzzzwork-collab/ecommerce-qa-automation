const { test, expect } = require('@playwright/test');

test('CART-001: quantity changes update the cart total', async ({ page }) => {
  await page.goto('/');

  // Add one mouse and verify its price.
  await page.getByRole('button', {
    name: 'Add Wireless Mouse to cart',
    exact: true
  }).click();

  await expect(page.getByTestId('cart-total')).toHaveText('499.00');

  // Change quantity, then leave the field to commit the change.
  const quantity = page.getByLabel('Quantity for Wireless Mouse');
  await quantity.fill('2');
  await quantity.press('Tab');

  await expect(quantity).toHaveValue('2');
  await expect(page.getByTestId('cart-total')).toHaveText('998.00');

  // Removing the last item should reset the cart and disable checkout.
  await page.getByRole('button', {
    name: 'Remove Wireless Mouse from cart',
    exact: true
  }).click();

  await expect(page.getByText('Your cart is empty.', {
    exact: true
  })).toBeVisible();

  await expect(page.getByTestId('cart-total')).toHaveText('0.00');

  await expect(page.getByRole('button', {
    name: 'Place demo order',
    exact: true
  })).toBeDisabled();
});
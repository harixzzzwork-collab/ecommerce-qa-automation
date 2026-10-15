const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

async function addMouse(page) {
  await page.getByRole('button', {
    name: 'Add Wireless Mouse to cart',
    exact: true
  }).click();
}

test('CART-002: multiple products have the correct combined total', async ({ page }) => {
  await addMouse(page);

  await page.getByRole('button', {
    name: 'Add Mechanical Keyboard to cart',
    exact: true
  }).click();

  // Mouse ₹499 + keyboard ₹1999 = ₹2498.
  await expect(page.getByTestId('cart-total')).toHaveText('2498.00');

  await page.getByRole('button', {
    name: 'Remove Wireless Mouse from cart',
    exact: true
  }).click();

  await expect(page.getByTestId('cart-total')).toHaveText('1999.00');
  await expect(page.getByRole('button', {
    name: 'Place demo order',
    exact: true
  })).toBeEnabled();
});

test('CART-003: repeated additions cannot exceed five items', async ({ page }) => {
  // Attempt to add six mice; only five should be allowed.
  for (let attempt = 0; attempt < 6; attempt++) {
    await addMouse(page);
  }

  await expect(
    page.getByLabel('Quantity for Wireless Mouse')
  ).toHaveValue('5');

  await expect(page.getByTestId('cart-total')).toHaveText('2495.00');
});

// Invalid quantities should restore the previous valid quantity.
for (const value of ['0', '6', '1.5']) {
  test(`CART-004: rejects invalid quantity ${value}`, async ({ page }) => {
    await addMouse(page);

    const quantity = page.getByLabel('Quantity for Wireless Mouse');

    await quantity.fill(value);
    await quantity.press('Tab');

    await expect(quantity).toHaveValue('1');
    await expect(page.getByTestId('cart-total')).toHaveText('499.00');
  });
}

test('CHECKOUT-004: spaces-only name prevents order submission', async ({ page }) => {
  await addMouse(page);

  await page.getByLabel('Full name', { exact: true }).fill('   ');
  await page.getByLabel('Email', { exact: true }).fill('tester@example.com');
  await page.getByLabel('Delivery address').fill('123 Test Street');

  await page.getByRole('button', {
    name: 'Place demo order',
    exact: true
  }).click();

  await expect(page.getByRole('alert')).toHaveText(
    'Name and address must contain more than spaces.'
  );

  await expect(page.locator('#order-status')).toBeEmpty();
  await expect(page.getByTestId('cart-total')).toHaveText('499.00');
});
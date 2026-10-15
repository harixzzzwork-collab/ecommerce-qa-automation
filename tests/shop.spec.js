const { test, expect } = require('@playwright/test');

// Every test starts with a fresh browser session and an empty cart.
test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

async function addMouse(page) {
  await page.getByRole('button', {
    name: 'Add Wireless Mouse to cart',
    exact: true
  }).click();
}

async function fillCheckout(page, email = 'tester@example.com') {
  await page.getByLabel('Full name', { exact: true }).fill('Demo Customer');
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByLabel('Delivery address').fill('123 Test Street');
}

test('SHOP-001: catalog displays all three products', async ({ page }) => {
  await expect(page.getByRole('article')).toHaveCount(3);

  for (const name of ['Wireless Mouse', 'Mechanical Keyboard', 'USB-C Hub']) {
    await expect(
      page.getByRole('heading', { name, exact: true })
    ).toBeVisible();
  }
});

// One test is generated for each search value.
for (const query of ['mouse', 'MOUSE', '  mouse  ']) {
  test(`SEARCH-001: search supports ${JSON.stringify(query)}`, async ({ page }) => {
    await page.getByLabel('Search products').fill(query);

    await expect(page.getByRole('article')).toHaveCount(1);
    await expect(page.getByRole('heading', {
      name: 'Wireless Mouse',
      exact: true
    })).toBeVisible();

    // Clearing the search restores the complete catalog.
    await page.getByLabel('Search products').fill('');
    await expect(page.getByRole('article')).toHaveCount(3);
  });
}

test('SEARCH-002: unknown product shows no-results message', async ({ page }) => {
  await page.getByLabel('Search products').fill('spaceship');

  await expect(page.getByRole('article')).toHaveCount(0);
  await expect(page.getByText('No products found.', {
    exact: true
  })).toBeVisible();
});

test('CHECKOUT-001: valid details complete a demo order', async ({ page }) => {
  await addMouse(page);
  await fillCheckout(page);

  await page.getByRole('button', {
    name: 'Place demo order'
  }).click();

  await expect(page.locator('#order-status')).toHaveText(
    'Demo order confirmed! Total: ₹499.00. No payment was taken.'
  );

  await expect(page.getByTestId('cart-total')).toHaveText('0.00');
  await expect(page.getByText('Your cart is empty.', {
    exact: true
  })).toBeVisible();

  await expect(page.getByRole('button', {
    name: 'Place demo order'
  })).toBeDisabled();
});

test('CHECKOUT-002: missing name prevents order submission', async ({ page }) => {
  await addMouse(page);
  await fillCheckout(page);
  await page.getByLabel('Full name', { exact: true }).fill('');

  await page.getByRole('button', {
    name: 'Place demo order'
  }).click();

const nameInput = page.getByLabel('Full name', { exact: true });

  await expect.poll(() =>
    nameInput.evaluate(input => input.validity.valueMissing)
  ).toBe(true);

  await expect(page.locator('#order-status')).toBeEmpty();
  await expect(page.getByTestId('cart-total')).toHaveText('499.00');
});

test('CHECKOUT-003: invalid email prevents order submission', async ({ page }) => {
  await addMouse(page);
  await fillCheckout(page, 'invalid-email');

  await page.getByRole('button', {
    name: 'Place demo order'
  }).click();

const emailInput = page.getByLabel('Email', { exact: true });

  await expect.poll(() =>
    emailInput.evaluate(input => input.validity.typeMismatch)
  ).toBe(true);

  await expect(page.locator('#order-status')).toBeEmpty();
  await expect(page.getByTestId('cart-total')).toHaveText('499.00');
});
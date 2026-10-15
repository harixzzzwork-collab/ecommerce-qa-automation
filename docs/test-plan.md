# QA Demo Shop — Test Plan

## Objective
Verify product search, cart calculations, quantity limits, and
simulated checkout in a locally hosted practice application.

## Scope
- Product catalog and search
- Cart additions, removals, quantities, and totals
- Required fields, email format, and spaces-only name validation
- Successful demo checkout and cart reset

## Outside scope
Real payments, backend order processing, authentication, persistence,
load testing, and a full security or accessibility audit.

## Business rules
- Search ignores letter case and surrounding spaces.
- Clearing search restores all three products.
- Product quantities must be whole numbers from 1 through 5.
- Invalid quantity edits restore the previous valid quantity.
- Repeated additions cannot exceed five of the same product.
- Cart total equals the sum of price multiplied by quantity.
- There are no tax or shipping charges.
- Empty carts cannot be submitted.
- Checkout requires a nonblank name, valid email, and nonblank address.
- Successful checkout clears the cart without taking payment.

## Automated coverage
| Test ID | Coverage | Cases |
| --- | --- | ---: |
| SHOP-001 | Catalog contents | 1 |
| SEARCH-001 | Lowercase, uppercase, padded search; clearing search | 3 |
| SEARCH-002 | No matching products | 1 |
| CART-001 | Quantity update, removal, empty-cart checkout | 1 |
| CART-002 | Combined total and partial removal | 1 |
| CART-003 | Repeated additions capped at five | 1 |
| CART-004 | Reject quantities 0, 6, and 1.5 | 3 |
| CHECKOUT-001 | Successful order and cart reset | 1 |
| CHECKOUT-002 | Missing name | 1 |
| CHECKOUT-003 | Invalid email | 1 |
| CHECKOUT-004 | Spaces-only name | 1 |
| Total | Distinct automated cases | 15 |

## Environment and execution
- Local Node.js server: http://127.0.0.1:3000
- Playwright with Chromium, Firefox, and WebKit
- Each test starts with an isolated browser context.
- Run suite: npx playwright test
- Open report: npx playwright show-report

## Verified baseline — 15 October 2026
45 executions passed: 15 cases across three browser engines.
No failures, flaky results, or skipped tests in this local run.
GitHub Actions execution has not yet been verified.

## Remaining coverage
Separate checks for empty email, empty address, and spaces-only address
have not yet been automated.

## Completion criteria
- All 45 executions pass locally and in GitHub Actions.
- Controlled defect exercises show failure, diagnosis, fix, and retest.
- README explains setup, results, and limitations.
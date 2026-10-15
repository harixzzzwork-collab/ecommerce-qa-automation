# E-commerce QA Automation

[![Playwright Tests](https://github.com/harixzzzwork-collab/ecommerce-qa-automation/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/harixzzzwork-collab/ecommerce-qa-automation/actions/workflows/playwright.yml)

A portfolio project demonstrating test design, browser automation,
defect investigation, and regression testing using Playwright.

The application is a local practice store with simulated checkout.
It does not process real payments or store real orders.

## Results

- 15 distinct automated test cases.
- 45 executions across Chromium, Firefox, and WebKit.
- Latest verified local regression run: all 45 passed.
- Three deliberately introduced defects reproduced, documented,
  fixed, and retested.
- GitHub Actions verified on Ubuntu: all 45 executions passed on 15 October 2026.
- [Verified CI run](https://github.com/harixzzzwork-collab/ecommerce-qa-automation/actions/runs/38707622408) includes a saved HTML report artifact.

## Technology

JavaScript, Playwright, Node.js, Git, and GitHub Actions.

## Test coverage

| Area | Checks |
| --- | --- |
| Catalog | Three expected products |
| Search | Case handling, surrounding spaces, clearing, no results |
| Cart | Add/remove, quantity updates, combined totals |
| Boundaries | Maximum quantity, zero, above maximum, fractional values |
| Checkout | Successful order, missing name, invalid email, spaces-only name |
| Order completion | Confirmation, cart reset, disabled empty-cart checkout |

See [the test plan](docs/test-plan.md) for requirements,
coverage mapping, and remaining gaps.

## Run locally

Use Node.js 26 and an operating system supported by Playwright.

From the project directory:

```bash
npm ci
npx playwright install --with-deps
npx playwright test
```

Playwright starts and stops the local application server automatically.

### Run one browser

```bash
npx playwright test --project=chromium
```

### Watch a test run

```bash
npx playwright test cart.spec.js --project=chromium --headed
```

### View the latest report

```bash
npx playwright show-report
```

### Explore the store manually

```bash
node server.cjs
```

Open http://127.0.0.1:3000. Stop the server with Ctrl+C before
running automated tests.

## Controlled defect exercises

These were deliberately seeded training defects, not defects found
in a commercial product.

| Defect | Problem | Documentation |
| --- | --- | --- |
| DEF-001 | Uppercase searches return no products | [Report](docs/DEF-001.md) |
| DEF-002 | Cart total ignores quantity | [Report](docs/DEF-002.md) |
| DEF-003 | Spaces-only name bypasses validation | [Report](docs/DEF-003.md) |

Each report includes reproduction steps, expected and actual results,
root cause, fix, and retest results. Failure and passing reports are
preserved under docs/evidence.

To inspect a saved failure report:

```bash
npx playwright show-report docs/evidence/DEF-001/failing-report
```

## Continuous integration

The workflow runs on pushes and pull requests targeting main.
It also supports manual execution.

It installs dependencies and browser engines, runs the complete suite,
and retains the HTML report for seven days.

## Limitations

This project tests frontend behaviour in a controlled sample application.
It does not cover backend APIs, real payments, persistence, load testing,
or a full security or accessibility audit.

WebKit testing does not replace testing the actual Safari application.

## Learning and authorship

Built as an AI-assisted learning project. Implementation, test execution,
and controlled defect exercises were completed with guided assistance.
# QA Starter Kit — Playwright + TypeScript

[![tests](https://github.com/murillovskfilho/qa-starter-kit/actions/workflows/tests.yml/badge.svg)](https://github.com/murillovskfilho/qa-starter-kit/actions/workflows/tests.yml)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![License: MIT](https://img.shields.io/badge/license-MIT-blue)

A clean, production-ready starting point for test automation. Clone it, point it at your app,
and have UI and API tests running in CI in under an hour, without spending a week on boilerplate.

It runs out of the box against two public demo apps, so you can see every pattern working
before you change a single line.

## What you get

| Feature | Where |
|---|---|
| **UI tests** with Page Objects and accessible locators (roles, labels, test ids). No CSS/XPath in specs | `src/pages/`, `tests/ui/` |
| **API tests** with a typed client: every response is status-checked and validated against a schema | `src/api/`, `tests/api/` |
| **Contract checks** with strict [Zod](https://zod.dev) schemas: an added or renamed field fails the test | `src/api/schemas.ts` |
| **Typed fixtures**: Page Objects and API clients injected into each test, already set up | `src/fixtures/index.ts` |
| **Parallel-safe test data**: factories generate unique values, so tests never depend on each other | `src/fixtures/factories.ts` |
| **Multi-environment config** (`dev`, `staging`), switchable with one variable or overridable per URL | `src/config/environments.ts` |
| **CI on GitHub Actions**: typecheck, 2 parallel shards, retries with traces, one merged HTML report, nightly run. Read-only token, actions pinned to commit SHAs | `.github/workflows/tests.yml` |
| Debug artifacts: trace on retry, screenshot and video on failure | `playwright.config.ts` |

## Quick start

Requirements: Node.js 20+.

```bash
npm ci
npx playwright install chromium
npm test          # runs API + UI tests
npm run report    # opens the HTML report
```

Other scripts:

| Script | What it does |
|---|---|
| `npm run test:api` | API tests only (no browser) |
| `npm run test:ui` | UI tests only |
| `npm run test:headed` | UI tests with a visible browser |
| `npm run test:debug` | Playwright UI mode: watch, step through and time-travel each test |
| `npm run typecheck` | TypeScript check |

## Point it at your app (15 minutes)

1. **Set your URLs.** Edit `src/config/environments.ts`, or copy `.env.example` to `.env`
   and set `BASE_URL` / `API_URL`. Keep the trailing slash.
2. **Replace the Page Object.** Use `src/pages/TodoPage.ts` as the model for your first page:
   locators in the constructor, user actions as methods.
3. **Replace the API client.** Copy `src/api/PostsClient.ts` and `src/api/schemas.ts`
   for your first resource. Describe the response with a Zod schema; the client does the rest.
4. **Register them as fixtures** in `src/fixtures/index.ts`.
5. **Write specs** that import `test` and `expect` from `src/fixtures`, not from `@playwright/test`.
6. **Delete the demo specs** in `tests/` once yours are in place.

Switch environments with `TEST_ENV`. The `staging` entry ships with placeholder URLs on purpose,
so it fails loudly until you point it at your real staging:

```bash
TEST_ENV=staging npm test
```

In CI, run the workflow manually and pick the environment from the dropdown.

## Conventions

- **Specs describe behavior, Page Objects describe the UI.** If a spec has a locator, it belongs in a Page Object.
- **Prefer user-facing locators**: `getByRole`, `getByLabel`, `getByPlaceholder`, then `getByTestId`.
- **Never share state between tests.** Each test creates its own data with a factory.
- **Use web-first assertions** (`await expect(locator).toHaveText(...)`). No manual waits or `waitForTimeout`.
- **Validate contracts at the client**, not in each spec. Specs assert on business rules.

## Project structure

```
.
├── .github/workflows/tests.yml   CI: typecheck, sharded run, merged report
├── src/
│   ├── api/                      typed API clients + response schemas
│   ├── config/                   environments
│   ├── fixtures/                 test fixtures + data factories
│   └── pages/                    Page Objects
├── tests/
│   ├── api/                      API specs (no browser)
│   └── ui/                       UI specs
└── playwright.config.ts
```

## Pro version (in development)

**QA Starter Kit Pro** will add AI-assisted tooling on top of this base:

- **Failure triage**: reads the test results, groups similar failures and labels each one as a likely
  flaky test, a real bug or an environment issue, with an explanation.
- **Test generation from OpenAPI**: turns your API spec into ready-to-edit API test files.
- **User story → test cases**: turns a story into manual test cases and an automated test skeleton.

Watch or star this repository to hear when it ships.

## License

MIT

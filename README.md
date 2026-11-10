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

## Design decisions and trade-offs

- **Contracts are checked in the client, with strict schemas.** Every `PostsClient` method checks the
  status and parses the body with a Zod `strictObject`, so specs get typed data and only assert on
  business rules. Strict means an added or renamed field fails the test, which catches drift early
  but also fails on harmless additions; loosening a schema has to be a deliberate change. Negative
  tests use the `*Raw` methods, which return the response unparsed.
- **Fixtures hand each test a ready page and client.** `todoPage` is created and already opened,
  `posts` is already bound to the API's base URL, so a spec starts at the behavior it tests. The
  cost: the page fixture always navigates first, so a test that needs to start somewhere else needs
  its own fixture.
- **Parallel by default, made safe by the data.** `fullyParallel` is on, and the factories build every
  title and payload from a timestamp, the process id and a counter, so tests share nothing and run in
  any order, in any shard. It only works while every test creates its own data; one test that reuses
  a fixed record brings back ordering bugs.
- **Retries in CI, with the evidence kept.** CI retries a failed test twice, records a trace on the
  first retry, and keeps the screenshot and video on failure; `forbidOnly` stops a stray `test.only`
  from shrinking the run. The trade-off: a test that passes on retry leaves the build green. The
  report marks it as flaky, but someone has to read the report.
- **A locked-down, reproducible pipeline.** Tests run in 2 shards in the official Playwright container,
  and a final job merges their blob reports into one HTML report. The workflow token is read-only,
  every action is pinned to a commit SHA, and the container is pinned by digest, with a step that
  fails if `@playwright/test` in the lockfile and the image version drift apart. The costs: a third
  job and three `npm ci` runs, which only pay off as the suite grows, and manual upgrades, because
  the tag, the digest and the package have to move together in one change.
- **Runs out of the box against public demos.** `dev` points at TodoMVC and JSONPlaceholder, so the
  kit works before you change a line, and `staging` ships with placeholder URLs so it fails loudly
  until it is configured. The limits are the demos' limits: the suite depends on third-party sites,
  JSONPlaceholder does not persist writes (so POST and PUT tests can only check the echoed payload),
  and the UI project runs on Chromium only.

## What I'd add next

- A spec that proves the contract check works: feed the client a response with an extra field and
  expect it to fail.
- An auth setup project that signs in once and reuses the saved session, for apps behind a login.
- Firefox and WebKit projects, switched on with one line each in `playwright.config.ts`.
- A demo API that keeps its data, so the create tests can read back what they wrote.

## Pro version (in development)

**QA Starter Kit Pro** will add AI-assisted tooling on top of this base:

- **Failure triage**: reads the test results, groups similar failures and labels each one as a likely
  flaky test, a real bug or an environment issue, with an explanation.
- **Test generation from OpenAPI**: turns your API spec into ready-to-edit API test files.
- **User story → test cases**: turns a story into manual test cases and an automated test skeleton.

Watch or star this repository to hear when it ships.

## License

MIT

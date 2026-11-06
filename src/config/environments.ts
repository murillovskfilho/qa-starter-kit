import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export type EnvName = 'dev' | 'staging';

export interface Environment {
  /** Web app under test (used by UI tests). */
  baseURL: string;
  /** REST API under test (used by API tests). */
  apiURL: string;
}

/**
 * One entry per environment. Point these at your own app.
 * The defaults target public demo apps so the kit runs out of the box.
 * Keep the trailing slash: pages and API paths are resolved relative to it,
 * so URLs with a path prefix (https://host/app/) keep working.
 */
const environments: Record<EnvName, Environment> = {
  dev: {
    baseURL: 'https://demo.playwright.dev/todomvc/',
    apiURL: 'https://jsonplaceholder.typicode.com/',
  },
  staging: {
    baseURL: 'https://demo.playwright.dev/todomvc/',
    apiURL: 'https://jsonplaceholder.typicode.com/',
  },
};

function resolveEnvName(): EnvName {
  const name = process.env.TEST_ENV ?? 'dev';
  if (!(name in environments)) {
    throw new Error(`Unknown TEST_ENV "${name}". Expected one of: ${Object.keys(environments).join(', ')}`);
  }
  return name as EnvName;
}

export const envName = resolveEnvName();

export const env: Environment = {
  baseURL: process.env.BASE_URL ?? environments[envName].baseURL,
  apiURL: process.env.API_URL ?? environments[envName].apiURL,
};

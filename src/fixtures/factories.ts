import type { NewPost } from '../api/schemas';

/**
 * Test data factories. Every value is unique per call, so tests stay
 * independent and safe to run in parallel.
 */
let sequence = 0;

export function uniqueSuffix(): string {
  sequence += 1;
  return `${Date.now().toString(36)}-${process.pid}-${sequence}`;
}

export function buildPost(overrides: Partial<NewPost> = {}): NewPost {
  const suffix = uniqueSuffix();
  return {
    userId: 1,
    title: `QA post ${suffix}`,
    body: `Created by an automated test (${suffix})`,
    ...overrides,
  };
}

export function buildTodoTitle(label = 'Task'): string {
  return `${label} ${uniqueSuffix()}`;
}

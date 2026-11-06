import { test as base } from '@playwright/test';
import { PostsClient } from '../api/PostsClient';
import { TodoPage } from '../pages/TodoPage';

interface Fixtures {
  todoPage: TodoPage;
  posts: PostsClient;
}

/**
 * Import `test` and `expect` from here instead of '@playwright/test'.
 * Page Objects and API clients are injected per test, already set up.
 */
export const test = base.extend<Fixtures>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.open();
    await use(todoPage);
  },
  posts: async ({ request }, use) => {
    await use(new PostsClient(request));
  },
});

export { expect } from '@playwright/test';

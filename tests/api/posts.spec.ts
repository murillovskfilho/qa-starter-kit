import { test, expect } from '../../src/fixtures';
import { buildPost } from '../../src/fixtures/factories';

test.describe('Posts API', () => {
  test('GET /posts/:id returns a post matching the contract', async ({ posts }) => {
    const post = await posts.get(1);

    expect(post.id).toBe(1);
  });

  test('GET /posts filters by userId', async ({ posts }) => {
    const result = await posts.list({ userId: 2 });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((post) => post.userId === 2)).toBe(true);
  });

  test('POST /posts creates a post and echoes the payload', async ({ posts }) => {
    const payload = buildPost();

    const created = await posts.create(payload);

    expect(created).toMatchObject(payload);
    expect(created.id).toBeGreaterThan(0);
  });

  test('PUT /posts/:id replaces the post', async ({ posts }) => {
    const payload = buildPost({ userId: 3 });

    const updated = await posts.update(1, payload);

    expect(updated).toEqual({ ...payload, id: 1 });
  });

  test('DELETE /posts/:id succeeds', async ({ posts }) => {
    const response = await posts.raw().delete('posts/1');

    expect(response.status()).toBe(200);
  });

  test('GET /posts/:id returns 404 for an unknown id', async ({ posts }) => {
    const response = await posts.raw().get('posts/999999');

    expect(response.status()).toBe(404);
  });

  for (const invalidId of ['abc', '-1', '0']) {
    test(`GET /posts/${invalidId} does not return a post`, async ({ posts }) => {
      const response = await posts.raw().get(`posts/${invalidId}`);

      expect(response.status()).toBe(404);
    });
  }
});

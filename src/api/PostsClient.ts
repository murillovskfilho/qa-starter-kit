import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import { z } from 'zod';
import { PostListSchema, PostSchema, type NewPost, type Post } from './schemas';

/**
 * Typed API client. Each method checks the status code and validates the body
 * against its schema, so specs only deal with typed data.
 * Paths have no leading slash: they resolve relative to the project's baseURL.
 */
export class PostsClient {
  constructor(private readonly request: APIRequestContext) {}

  async list(filter: { userId?: number } = {}): Promise<Post[]> {
    const response = await this.request.get('posts', { params: filter });
    return parse(response, 200, PostListSchema);
  }

  async get(id: number): Promise<Post> {
    const response = await this.request.get(`posts/${id}`);
    return parse(response, 200, PostSchema);
  }

  async create(post: NewPost): Promise<Post> {
    const response = await this.request.post('posts', { data: post });
    return parse(response, 201, PostSchema);
  }

  async update(id: number, post: NewPost): Promise<Post> {
    const response = await this.request.put(`posts/${id}`, { data: { ...post, id } });
    return parse(response, 200, PostSchema);
  }

  /** Raw access for negative tests that assert on status codes. */
  raw(): APIRequestContext {
    return this.request;
  }
}

async function parse<T>(response: APIResponse, expectedStatus: number, schema: z.ZodType<T>): Promise<T> {
  const body = await response.text();
  expect(response.status(), `${response.url()} returned: ${body.slice(0, 500)}`).toBe(expectedStatus);
  const result = schema.safeParse(JSON.parse(body));
  if (!result.success) {
    throw new Error(`Contract violation on ${response.url()}:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

import { z } from 'zod';

/**
 * Response contracts. Strict objects fail the test when the API adds or
 * renames a field, so contract drift is caught instead of silently ignored.
 */
export const PostSchema = z.strictObject({
  userId: z.number().int().positive(),
  id: z.number().int().positive(),
  title: z.string().min(1),
  body: z.string(),
});

export const PostListSchema = z.array(PostSchema);

export const NewPostSchema = PostSchema.omit({ id: true });

export type Post = z.infer<typeof PostSchema>;
export type NewPost = z.infer<typeof NewPostSchema>;

import Schema from "$lib/business/schema/Schema";
import type { InferOutput } from "valibot";
import { maxLength, minLength, object, parse, pipe, string, trim } from "valibot";
import AuthSchema from "./AuthSchema";

export type PostShape = InferOutput<typeof PostSchema.POST_SCHEMA>
export type InsertPostShape = InferOutput<typeof PostSchema.INSERT_POST_SCHEMA>

export default class PostSchema {
  public static INSERT_POST_SCHEMA = object({
    content: pipe(
      string("Content must be a string."),
      trim(),
      minLength(16, "Content must be at least 16 characters long."),
      maxLength(512, "Content must be at most 512 characters long."),
    ),
  });
  public static POST_SCHEMA = object({
    ...this.INSERT_POST_SCHEMA.entries,
    id: Schema.ID_SCHEMA,
    author: AuthSchema.CURRENT_USER_SCHEMA,
    createdAt: Schema.CREATED_AT_SCHEMA,
  });

  public static getValidPost(data: unknown): PostShape {
    return parse(this.POST_SCHEMA, data);
  }
}

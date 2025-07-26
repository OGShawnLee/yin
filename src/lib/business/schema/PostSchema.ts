import type { InferOutput } from "valibot";
import Schema from "@business/schema/Schema";
import AuthSchema from "@business/schema/AuthSchema";
import { boolean, integer, maxLength, minLength, number, object, parse, pipe, string, trim } from "valibot";

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
    bookmarkCount: pipe(
      number("Bookmark count must be a number."),
      integer("Bookmark count must be an integer."),
    ),
    favouriteCount: pipe(
      number("Favourite count must be a number."),
      integer("Favourite count must be an integer."),
    ),
    isFavourite: boolean("Property isFavourite must be a boolean."),
    isBookmarked: boolean("Property isBookmarked must be a boolean."),
    createdAt: Schema.CREATED_AT_SCHEMA,
  });

  public static getValidPost(data: unknown): PostShape {
    return parse(this.POST_SCHEMA, data);
  }
}

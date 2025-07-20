import Schema from "$lib/business/schema/Schema";
import type { InferOutput } from "valibot";
import { maxLength, minLength, nullish, object, parse, pipe, regex, string, trim } from "valibot";

export type UserShape = InferOutput<typeof UserSchema.USER_SCHEMA>

export default class UserSchema {
  private static DISPLAY_NAME_REGEX = /^[a-zA-Z0-9_]+$/;
  
  public static NAME_SCHEMA = pipe(
    string("Name must be a string."),
    trim(),
    minLength(3, "Name must be at least 3 characters long."),
    maxLength(64, "Name must be at most 64 characters long."),
  );
  public static DISPLAY_NAME_SCHEMA = pipe(
    string("Username must be a string."),
    trim(),
    regex(this.DISPLAY_NAME_REGEX, "Username can only contain letters, numbers, and underscores."),
    minLength(3, "Username must be at least 3 characters long."),
    maxLength(16, "Username must be at most 16 characters long")
  );
  public static USER_SCHEMA = object({
    id: Schema.ID_SCHEMA,
    displayName: this.DISPLAY_NAME_SCHEMA,
    name: this.NAME_SCHEMA,
    location: nullish(
      pipe(
        string("Location must be a string."),
        trim(),
        minLength(3, "Location must be at least 3 characters long."),
        maxLength(64, "Location must be at most 64 characters long."),
      )
    ),
    description: nullish(
      pipe(
        string("Description must be a string."),
        trim(),
        minLength(3, "Description must be at least 3 characters long."),
        maxLength(256, "Description must be at most 256 characters long."),
      )
    ),
    createdAt: Schema.CREATED_AT_SCHEMA,
  });

  public static getValidUser(data: unknown): UserShape {
    return parse(this.USER_SCHEMA, data);
  }
}

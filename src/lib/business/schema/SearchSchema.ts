import type { InferOutput } from "valibot";
import { boolean, maxLength, minLength, nullable, object, pipe, string } from "valibot";

export type SearchSchemaShape = InferOutput<typeof SearchSchema.SEARCH_SCHEMA>;

export default class SearchSchema {
  public static SEARCH_SCHEMA = object({
    query: nullable(
      pipe(
        string('Search query must be a string.'),
        minLength(3, 'Search query must be at least 3 characters long.'),
        maxLength(256, 'Search query must be at most 256 characters long.')
      )
    ),
    people: nullable(
      boolean('People field must be a boolean.')
    )
  }); 
}
import { date, nullish, object, pipe, string, transform, union, uuid } from "valibot";

export default class Schema {
  public static ID_SCHEMA = pipe(
    string("ID must be a string."),
    uuid("ID must be a valid UUID."),
  );
  public static ID_OBJECT_SCHEMA = object({
    id: Schema.ID_SCHEMA
  });
  public static CREATED_AT_SCHEMA = nullish(
    pipe(
      union([string(), date()], 'Created At must be a string or a date.'),
      transform((value) => (typeof value === 'string' ? new Date(value) : value)),
      date('Created At must be a valid date.')
    )
  );
}

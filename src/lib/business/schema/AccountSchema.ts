import Schema from "$lib/business/schema/Schema";
import UserSchema from "$lib/business/schema/UserSchema";
import type { InferOutput } from "valibot";
import { email, integer, maxLength, minLength, number, object, parse, pipe, string, trim } from "valibot";

export type Account = InferOutput<typeof AccountSchema.ACCOUNT_SCHEMA>

export default class AccountSchema {
  private static PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,64}$/;

  public static ACCOUNT_SCHEMA = object({
    id: Schema.ID_SCHEMA,
    name: UserSchema.NAME_SCHEMA,
    displayName: UserSchema.DISPLAY_NAME_SCHEMA,
    password: pipe(
      string("Password must be a string."),
      trim(),
      minLength(8, "Password must be at least 8 characters long."),
      maxLength(64, "Password must be at most 64 characters long")
    ),
    email: pipe(string("Email must be a string"),
      email(),
      trim(),
      minLength(3, "Email must be at least 3 characters long."),
      maxLength(128, "Email must be at most 128 characters long")
    ),
    refreshTokenVersion: pipe(
      number('Versión de Token de Actualización debe ser un número.'),
      integer('Versión de Token de Actualización debe ser un número entero.')
    ),
    createdAt: Schema.CREATED_AT_SCHEMA,
  });

  public static getValidAccount(data: unknown): Account {
    return parse(this.ACCOUNT_SCHEMA, data);
  }
}

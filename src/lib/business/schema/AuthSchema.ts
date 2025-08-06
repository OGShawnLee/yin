import type { InferOutput } from "valibot";
import AccountSchema from "@business/schema/AccountSchema";
import UserSchema from "@business/schema/UserSchema";
import { object, parse, safeParse } from "valibot";

export type CurrentUserShape = InferOutput<typeof AuthSchema.CURRENT_USER_SCHEMA>;
export type SignInShape = InferOutput<typeof AuthSchema.SIGN_IN_SCHEMA>;
export type SignUpShape = InferOutput<typeof AuthSchema.SIGN_UP_SCHEMA>;

export default class AuthSchema {
  public static CURRENT_USER_SCHEMA = object({
    id: AccountSchema.ACCOUNT_SCHEMA.entries.id,
    name: UserSchema.NAME_SCHEMA,
    displayName: AccountSchema.ACCOUNT_SCHEMA.entries.displayName,
    isPro: UserSchema.USER_SCHEMA.entries.isPro
  });

  public static SIGN_IN_SCHEMA = object({
    displayName: AccountSchema.ACCOUNT_SCHEMA.entries.displayName,
    password: AccountSchema.ACCOUNT_SCHEMA.entries.password,
  });

  public static SIGN_UP_SCHEMA = object({
    ...this.SIGN_IN_SCHEMA.entries,
    email: AccountSchema.ACCOUNT_SCHEMA.entries.email,
    name: UserSchema.NAME_SCHEMA,
    confirmPassword: AccountSchema.ACCOUNT_SCHEMA.entries.password,
  })

  public static getValidCurrentUser(data: unknown): CurrentUserShape {
    return parse(this.CURRENT_USER_SCHEMA, data);
  }

  public static isValidCurrentUser(data: unknown): data is CurrentUserShape {
    return safeParse(this.CURRENT_USER_SCHEMA, data).success;
  }

  public static getValidSignIn(data: unknown): SignInShape {
    return parse(this.SIGN_IN_SCHEMA, data);
  }

  public static getValidSignUp(data: unknown): SignUpShape {
    return parse(this.SIGN_UP_SCHEMA, data);
  }
}

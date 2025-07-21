
import { YinAuthCrypto } from "$lib/YinAuth";
import type { SignUpShape } from "@business/schema/AuthSchema";
import ErrorHandler from "@common/ErrorHandler";
import NotFoundError from "@db/NotFoundError";
import DBClient from "@db/DBClient";
import e from "@db:qb";
import type { UpdateUserShape } from "@business/schema/UserSchema";

export class UserDAO {
  public static createOne(credentials: SignUpShape) {
    return ErrorHandler.useAwait(async () => {
      return e.insert(e.User, {
        account: e.insert(e.Account, {
          email: credentials.email,
          password: await YinAuthCrypto.createHashedPassword(credentials.password),
        }),
        name: credentials.name,
        displayName: credentials.displayName,
      }).run(DBClient);
    })
  }

  public static getOne(displayName: string) {
    return ErrorHandler.useAwait(async () => {
      const user = await e.select(e.User, () => ({
        id: true,
        name: true,
        displayName: true,
        description: true,
        location: true,
        createdAt: true,
        filter_single: { displayName }
      })).run(DBClient);

      if (user) return user;

      throw new NotFoundError("Unable to find user. The user doesn't exist.");
    })
  }

  public static updateOne(displayName: string, data: UpdateUserShape) {
    return ErrorHandler.useAwait(() => {
      return e.update(e.User, () => ({
        set: data,
        filter_single: { displayName }
      })).run(DBClient);
    });
  }
}
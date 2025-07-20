
import { YinAuthCrypto } from "$lib/YinAuth";
import type { SignUpShape } from "@business/schema/AuthSchema";
import ErrorHandler from "@common/ErrorHandler";
import DBClient from "@db/DBClient";
import e from "@db:qb";

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
}
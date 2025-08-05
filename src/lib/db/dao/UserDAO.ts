
import type { UpdateUserShape } from "@business/schema/UserSchema";
import type { CurrentUserShape, SignUpShape } from "@business/schema/AuthSchema";
import { YinAuthCrypto } from "$lib/YinAuth";
import ErrorHandler from "@common/ErrorHandler";
import NotFoundError from "@db/NotFoundError";
import e from "@db:qb";
import { getClient } from "@db/DBClient";

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
      }).run(getClient());
    })
  }

  public static getOne(displayName: string, currentUser: CurrentUserShape | null) {
    return ErrorHandler.useAwait(async () => {
      const user = await e.select(e.User, () => ({
        id: true,
        name: true,
        displayName: true,
        description: true,
        location: true,
        followerCount: true,
        followingCount: true,
        isFollowing: true,
        isPro: true,
        isFounder: true,
        isStaff: true,
        createdAt: true,
        filter_single: { displayName },
      })).run(getClient(currentUser));

      if (user) return user;

      throw new NotFoundError("Unable to find user. The user doesn't exist.");
    })
  }

  public static getOneReference(displayName: string) {
    return e.select(e.User, () => ({
      filter_single: { displayName },
    }));
  }

  public static updateOne(displayName: string, data: UpdateUserShape) {
    return ErrorHandler.useAwait(() => {
      return e.update(e.User, () => ({
        set: data,
        filter_single: { displayName }
      })).run(getClient());
    });
  }

  public static deleteOne(displayName: string) {
    return ErrorHandler.useAwait(() => {
      return e.delete(e.User, () => ({
        filter_single: { displayName }
      })).run(getClient());
    });
  }
}
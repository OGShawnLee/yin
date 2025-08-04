import type { CurrentUserShape } from "@business/schema/AuthSchema";
import ErrorHandler from "@common/ErrorHandler";
import e from "@db:qb";
import { getClient } from "@db/DBClient";

export default class RepostDAO {
  public static createOne(id: string, currentUser: CurrentUserShape) {
    return ErrorHandler.useAwait(() =>
      e.insert(e.Repost, {
        user: e.select(e.User, () => ({
          filter_single: { displayName: currentUser.displayName }
        })),
        post: e.select(e.Post, () => ({
          filter_single: { id }
        }))
      }).run(getClient())
    );
  }
}
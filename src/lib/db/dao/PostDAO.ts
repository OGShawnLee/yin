import type { CurrentUserShape } from "@business/schema/AuthSchema";
import type { InsertPostShape } from "@business/schema/PostSchema";
import ErrorHandler from "@common/ErrorHandler";
import DBClient from "@db/DBClient";
import e from "@db:qb";

export default class PostDAO {
  public static async createOne(post: InsertPostShape, currentUser: CurrentUserShape) {
    return ErrorHandler.useAwait(() => {
      return e.insert(e.Post, {
        content: post.content,
        author: e.select(e.User, () => ({
          filter_single: { displayName: currentUser.displayName }
        }))
      }).run(DBClient);
    })
  }

  public static async getAll() {
    return ErrorHandler.useAwait(() => {
      return e.select(e.Post, (post) => ({
        id: true,
        content: true,
        author: { id: true, name: true, displayName: true },
        createdAt: true,
        order_by: post.createdAt
      })).run(DBClient);
    })
  }
}
import type { CurrentUserShape } from "@business/schema/AuthSchema";
import type { Transaction } from "gel/dist/transaction";
import ErrorHandler from "@common/ErrorHandler";
import e from "@db:qb";
import { getClient } from "@db/DBClient";
import PostDAO from "./PostDAO";

export default class BookmarkDAO {
  private static createOne(id: string, currentUser: CurrentUserShape, transaction?: Transaction) {
    return ErrorHandler.useAwait(() => {
      return ErrorHandler.useAwait(() => {
        return e.insert(e.Bookmark, {
          user: e.select(e.User, () => ({
            filter_single: { displayName: currentUser.displayName }
          })),
          post: e.select(e.Post, () => ({
            filter_single: { id }
          }))
        }).run(transaction || getClient());
      });
    });
  }

  public static async createOrDeleteOne(id: string, currentUser: CurrentUserShape) {
    const client = getClient();
    return client.transaction(async (context) => {
      const bookmark = await this.findOne(id, currentUser, context);

      if (bookmark.error) return bookmark;

      const fn = bookmark.data ? this.deleteOne : this.createOne;
      
      return fn(id, currentUser, context);
    });
  }

  private static findOne(id: string, currentUser: CurrentUserShape, transaction?: Transaction) {
    return ErrorHandler.useAwait(async () => {
      return await e.select(e.Bookmark, (bookmark) => ({
        id: true,
        user: { id: true, name: true, displayName: true },
        post: {
          id: true,
          content: true,
          createdAt: true
        },
        filter_single:
          e.op(
            e.op(bookmark.user.displayName, '=', currentUser.displayName),
            "and",
            e.op(bookmark.post.id, '=', e.uuid(id))
          )
      }))
        .run(getClient());
    })
  }

  public static getAll(currentUser: CurrentUserShape) {
    return ErrorHandler.useAwait(() => {
      return e.select(e.Bookmark, (bookmark) => ({
        id: true,
        post: PostDAO.POST_SHAPE(bookmark.post),
        filter: e.op(bookmark.user.displayName, '=', currentUser.displayName),
        order_by: {
          expression: bookmark.createdAt,
          direction: e.DESC
        }
      })).run(getClient(currentUser));
    });
  }

  private static deleteOne(id: string, currentUser: CurrentUserShape, transaction?: Transaction) {
    return ErrorHandler.useAwait(() => {
      return e.delete(e.Bookmark, (bookmark) => ({
        filter_single: e.op(
          e.op(bookmark.user.displayName, '=', currentUser.displayName),
          "and",
          e.op(bookmark.post.id, '=', e.uuid(id))
        )
      })).run(getClient());
    });
  }
}
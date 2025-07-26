import type { CurrentUserShape } from "@business/schema/AuthSchema";
import type { Transaction } from "gel/dist/transaction";
import ErrorHandler from "@common/ErrorHandler";
import e from "@db:qb";
import PostDAO from "./PostDAO";
import { getClient } from "@db/DBClient";

export default class FavouriteDAO {
  private static createOne(id: string, currentUser: CurrentUserShape, transaction?: Transaction) {
    return ErrorHandler.useAwait(() => {
      return ErrorHandler.useAwait(() => {
        return e.insert(e.Favourite, {
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
      const favourite = await this.findOne(id, currentUser, context);

      if (favourite.error) return favourite;

      const fn = favourite.data ? this.deleteOne : this.createOne;
      
      return fn(id, currentUser, context);
    });
  }

  private static findOne(id: string, currentUser: CurrentUserShape, transaction?: Transaction) {
    return ErrorHandler.useAwait(async () => {
      return await e.select(e.Favourite, (favourite) => ({
        id: true,
        user: { id: true, name: true, displayName: true },
        post: {
          id: true,
          content: true,
          createdAt: true
        },
        filter_single:
          e.op(
            e.op(favourite.user.displayName, '=', currentUser.displayName),
            "and",
            e.op(favourite.post.id, '=', e.uuid(id))
          )
      }))
        .run(transaction || getClient());
    })
  }

  public static getAll(currentUser: CurrentUserShape) {
    return ErrorHandler.useAwait(() => {
      return e.select(e.Favourite, (favourite) => ({
        id: true,
        post: PostDAO.POST_SHAPE(favourite.post),
        filter: e.op(favourite.user.displayName, '=', currentUser.displayName),
        order_by: {
          expression: favourite.createdAt,
          direction: e.DESC
        }
      })).run(getClient(currentUser));
    });
  }

  private static deleteOne(id: string, currentUser: CurrentUserShape, transaction?: Transaction) {
    return ErrorHandler.useAwait(() => {
      return e.delete(e.Favourite, (favourite) => ({
        filter_single: e.op(
          e.op(favourite.user.displayName, '=', currentUser.displayName),
          "and",
          e.op(favourite.post.id, '=', e.uuid(id))
        )
      })).run(transaction || getClient());
    });
  }
}
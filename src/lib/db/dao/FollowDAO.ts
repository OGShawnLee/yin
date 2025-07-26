import type { CurrentUserShape } from "@business/schema/AuthSchema";
import type { Transaction } from "gel/dist/transaction";
import ErrorHandler from "@common/ErrorHandler";
import e from "@db:qb";
import { getClient } from "@db/DBClient";

export default class FollowDAO {
  private static createOne(displayName: string, currentUser: CurrentUserShape, transaction?: Transaction) {
    return ErrorHandler.useAwait(() => {
      return ErrorHandler.useAwait(() => {
        return e.insert(e.Follow, {
          follower: e.select(e.User, () => ({
            filter_single: { displayName: currentUser.displayName }
          })),
          followee: e.select(e.User, () => ({
            filter_single: { displayName }
          }))
        }).run(transaction || getClient());
      });
    });
  }

  public static async createOrDeleteOne(displayName: string, currentUser: CurrentUserShape) {
    const client = getClient();
    return client.transaction(async (context) => {
      const follow = await this.findOne(displayName, currentUser, context);
      
      if (follow.error) return follow;
    
      const fn = follow.data ? this.deleteOne : this.createOne;

      return fn(displayName, currentUser, context);
    });
  }

  private static findOne(displayName: string, currentUser: CurrentUserShape, transaction?: Transaction) {
    return ErrorHandler.useAwait(async () => {
      return await e.select(e.Follow, (follow) => ({
        id: true,
        filter_single:
          e.op(
            e.op(follow.follower.displayName, '=', currentUser.displayName),
            "and",
            e.op(follow.followee.displayName, '=', displayName)
          )
      }))
        .run(transaction || getClient());
    })
  }

  public static getAll(currentUser: CurrentUserShape) {
    return ErrorHandler.useAwait(() => {
      return e.select(e.Follow, (follow) => ({
        id: true,
        filter: e.op(follow.follower.displayName, '=', currentUser.displayName),
        order_by: {
          expression: follow.createdAt,
          direction: e.DESC
        }
      })).run(getClient(currentUser));
    });
  }

  private static deleteOne(displayName: string, currentUser: CurrentUserShape, transaction?: Transaction) {
    return ErrorHandler.useAwait(() => {
      return e.delete(e.Follow, (follow) => ({
        filter_single: e.op(
          e.op(follow.follower.displayName, '=', currentUser.displayName),
          "and",
          e.op(follow.followee.displayName, '=', displayName)
        )
      })).run(transaction || getClient());
    });
  }
}
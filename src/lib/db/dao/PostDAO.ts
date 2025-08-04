import type { CurrentUserShape } from "@business/schema/AuthSchema";
import type { InsertPostShape } from "@business/schema/PostSchema";
import ErrorHandler from "@common/ErrorHandler";
import NotFoundError from "@db/NotFoundError";
import e from "@db:qb";
import { getClient } from "@db/DBClient";

export default class PostDAO {
  public static SHALLOW_POST_SHAPE = e.shape(e.Post, () => ({
    id: true,
    author: { id: true, name: true, displayName: true },
    content: true,
    bookmarkCount: true,
    favouriteCount: true,
    repostCount: true,
    isFavourite: true,
    isBookmarked: true,
    isReposted: true,
    createdAt: true
  }));
  public static POST_SHAPE =e.shape(e.Post, (post) => ({
    ...this.SHALLOW_POST_SHAPE(post),
    repostOf: this.SHALLOW_POST_SHAPE
  }));

  public static createOne(post: InsertPostShape, currentUser: CurrentUserShape) {
    return ErrorHandler.useAwait(() => {
      return e.insert(e.Post, {
        content: post.content,
        author: e.select(e.User, () => ({
          filter_single: { displayName: currentUser.displayName }
        }))
      }).run(getClient());
    })
  }

  public static getOne(id: string) {
    return ErrorHandler.useAwait(() => {
      const data = e.select(e.Post, (post) => ({
        ...this.POST_SHAPE(post),
        filter_single: { id },
      })).run(getClient());

      if (data) return data;

      throw new NotFoundError("Unable to find post. The post doesn't exist.");
    });
  }

  public static getAll(currentUser: CurrentUserShape | null) {
    return ErrorHandler.useAwait(() => {
      return e.select(e.Post, (post) => ({
        ...this.POST_SHAPE(post),
        order_by: { expression: post.createdAt, direction: e.DESC },
      })).run(getClient(currentUser));
    })
  }

  public static getAllFromFolloweed(currentUser: CurrentUserShape) {
    return ErrorHandler.useAwait(() => {
      return e.select(e.Post, (post) => ({
        ...this.POST_SHAPE(post),
        order_by: { expression: post.createdAt, direction: e.DESC },
        filter: e.op(
          "exists",
          e.select(e.Follow, (follow) => ({
            filter_single: e.op(
              e.op(follow.follower.displayName, '=', currentUser.displayName),
              "and",
              e.op(follow.followee.displayName, '=', post.author.displayName)
            ),
          }))
        ),
      })).run(getClient(currentUser));
    })
  }

  public static getAllByAuthor(displayName: string, currentUser: CurrentUserShape | null) {
    return ErrorHandler.useAwait(() => {
      return e.select(e.Post, (post) => ({
        ...this.POST_SHAPE(post),
        order_by: { expression: post.createdAt, direction: e.DESC },
        filter: e.op(post.author.displayName, '=', displayName)
      })).run(getClient(currentUser));
    })
  }
}
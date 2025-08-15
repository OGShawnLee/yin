import type { CurrentUserShape } from "@business/schema/AuthSchema";
import type { InsertPostShape } from "@business/schema/PostSchema";
import e from "@db:qb";
import ErrorHandler from "@common/ErrorHandler";
import PostDAO from "@db/dao/PostDAO";
import NotFoundError from "@db/NotFoundError";
import { UserDAO } from "@db/dao/UserDAO";
import { getClient } from "@db/DBClient";

export default class DraftDAO {
  public static createOne(data: InsertPostShape, quoteOf: string | undefined, currentUser: CurrentUserShape) {
    return ErrorHandler.useAwait(() => {
      return e.insert(e.Draft, {
        user: UserDAO.getOneReference(currentUser.displayName),
        quoteOf: quoteOf ? PostDAO.getOneReference(quoteOf) : undefined,
        content: data.content
      }).run(getClient(currentUser));
    });
  }

  public static getOne(id: string, currentUser: CurrentUserShape) {
    return ErrorHandler.useAwait(async () => {
      const draft = await e.select(e.Draft, (draft) => ({
        id: true,
        content: true,
        quoteOf: PostDAO.SHALLOW_POST_SHAPE(draft.quoteOf),
        filter_single: e.op(
          e.op(draft.id, "=", e.uuid(id)),
          "and",
          e.op(draft.user.displayName, "=", currentUser.displayName)
        )
      })).run(getClient(currentUser));

      if (draft) return draft;

      throw new NotFoundError("Unable to find Draft. It doesn't exist.");
    });
  }

  public static updateOne(id: string, data: InsertPostShape, currentUser: CurrentUserShape) {
    return ErrorHandler.useAwait(async () => {
      return e.update(e.Draft, (draft) => ({
        set: {
          content: data.content
        },
        filter_single: e.op(
          e.op(draft.id, "=", e.uuid(id)),
          "and",
          e.op(draft.user.displayName, "=", currentUser.displayName)
        )
      })).run(getClient(currentUser));
    });
  }

  public static publishOne(id: string, data: InsertPostShape, currentUser: CurrentUserShape) {
    return ErrorHandler.useAwait(() => {
      const updated = e.update(e.Draft, (draft) => ({
        set: {
          content: data.content
        },
        filter_single: e.op(
          e.op(draft.id, "=", e.uuid(id)),
          "and",
          e.op(draft.user.displayName, "=", currentUser.displayName)
        )
      }));
      return e.insert(e.Post, {
        user: UserDAO.getOneReference(currentUser.displayName),
        content: updated.content,
        quoteOf: updated.quoteOf,
      }).run(getClient(currentUser));
    });
  }
}
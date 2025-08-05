import type { CurrentUserShape } from "@business/schema/AuthSchema";
import type { InsertPostShape } from "@business/schema/PostSchema";
import ErrorHandler from "@common/ErrorHandler";
import e from "@db:qb";
import { getClient } from "@db/DBClient";
import { UserDAO } from "./UserDAO";
import PostDAO from "./PostDAO";

export default class QuoteDAO {
  public static createOne(id: string, data: InsertPostShape, currentUser: CurrentUserShape) {
    return ErrorHandler.useAwait(() => {
      const user = UserDAO.getOneReference(currentUser.displayName);
      const quoteOf = PostDAO.getOneReference(id);
      const quote = e.insert(e.Quote, {
        quoteOf,
        user,
        post: e.insert(e.Post, {
          quoteOf,
          user,
          content: data.content,
        })
      });
      return e.select(quote, () => ({ post: { id: true } }))
        .run(getClient())
        .then((result) => ({ id: result.post.id }));
    });
  }
}
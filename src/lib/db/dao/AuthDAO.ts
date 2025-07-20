import type { CurrentUserShape } from "@business/schema/AuthSchema";
import AuthSchema from "@business/schema/AuthSchema";
import DBClient from "@db/DBClient";
import NotFoundError from "@db/NotFoundError";
import e from "@db:qb";

export default class AuthDAO {
  public static async findCurrentUser(payload: CurrentUserShape): Promise<CurrentUserShape | null> {
    const user = e.select(e.User, () => ({
      filter_single: { displayName: payload.displayName }
    }));
    const currentUser = await e.select({
      id: user.id,
      name: user.name,
      displayName: user.displayName,
    }).run(DBClient);

    if (currentUser.id) {
      return AuthSchema.getValidCurrentUser(currentUser);
    }

    throw new NotFoundError("Current User doesn't exist.");
  }
}

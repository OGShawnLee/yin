import AuthClient from "@business/auth/AuthClient";
import FollowDAO from "@db/dao/FollowDAO";
import PostDAO from "@db/dao/PostDAO";
import { error } from "@sveltejs/kit";

export async function load(event) {
  const result = await PostDAO.getAllByAuthor(
    event.params.displayName,
    await AuthClient.findAuthPayloadFromCookies(event.cookies)
  );

  if (result.error) {
    throw error(500, { message: result.error.message });
  }

  return {
    postList: result.data
  }
}

export const actions = {
  "handle-follow": async (event) => {
    const user = await AuthClient.getAuthPayloadFromCookies(event.cookies);
    const { error: err } = await FollowDAO.createOrDeleteOne(event.params.displayName, user);

    if (err) {
      error(500, { message: err.message });
    }
  }
}
import AuthClient from "@business/auth/AuthClient"
import BookmarkDAO from "@db/dao/BookmarkDAO";
import FavouriteDAO from "@db/dao/FavouriteDAO";
import PostDAO from "@db/dao/PostDAO";
import RepostDAO from "@db/dao/RepostDAO";
import NotFoundError from "@db/NotFoundError";
import { error } from "@sveltejs/kit";

export async function load(event) {
  const { data, error: err } = await PostDAO.getOne(event.params.id);

  if (err) {
    const status = err instanceof NotFoundError ? 404 : 500;
    error(status, { message: err.message });
  }

  return { post: data };
}

export const actions = {
  "create-repost": async (event) => {
    const user = await AuthClient.getAuthPayloadFromCookies(event.cookies);
    const { error: err } = await RepostDAO.createOne(event.params.id, user);

    if (err) {
      error(500, { message: err.message });
    }
  },
  "handle-bookmark": async (event) => {
    const user = await AuthClient.getAuthPayloadFromCookies(event.cookies);
    const { error: err } = await BookmarkDAO.createOrDeleteOne(event.params.id, user);

    if (err) {
      error(500, { message: err.message });
    }
  },
  "handle-favourite": async (event) => {
    const user = await AuthClient.getAuthPayloadFromCookies(event.cookies);
    const { error: err } = await FavouriteDAO.createOrDeleteOne(event.params.id, user);

    if (err) {
      error(500, { message: err.message });
    }
  }
}
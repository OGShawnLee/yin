import AuthClient from "@business/auth/AuthClient";
import BookmarkDAO from "@db/dao/BookmarkDAO";
import { error } from "@sveltejs/kit";

export async function load(event) {
  const currentUser = await AuthClient.getAuthPayloadFromCookies(event.cookies);
  const { data, error: err } = await BookmarkDAO.getAll(currentUser);
  
  if (err) {
    error(500, { message: err.message });
  }
  
  return { currentUser, bookmarkList: data };
}
import AuthClient from "@business/auth/AuthClient";
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
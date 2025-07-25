import AuthClient from "@business/auth/AuthClient";
import PostDAO from "@db/dao/PostDAO";
import { error } from "@sveltejs/kit";

export async function load(event) {
  const { data, error: err } = await PostDAO.getAll(
    await AuthClient.findAuthPayloadFromCookies(event.cookies)
  );

  if (err) {
    error(500, { message: err.message });
  }

  return { postList: data }
}
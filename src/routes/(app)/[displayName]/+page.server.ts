import PostDAO from "@db/dao/PostDAO";
import { error } from "@sveltejs/kit";

export async function load(event) {
  const result = await PostDAO.getAllByAuthor(event.params.displayName);

  if (result.error) {
    throw error(500, { message: result.error.message });
  }

  return {
    postList: result.data
  }
}
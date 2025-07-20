import PostDAO from "@db/dao/PostDAO";
import { error } from "@sveltejs/kit";

export async function load() {
  const { data, error: err } = await PostDAO.getAll();

  if (err) {
    error(500, { message: err.message });
  }

  return { postList: data }
}
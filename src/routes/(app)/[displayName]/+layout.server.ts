import { UserDAO } from "@db/dao/UserDAO";
import NotFoundError from "@db/NotFoundError";
import { error } from "@sveltejs/kit";

export async function load(event) {
  const { data, error: err } = await UserDAO.getOne(event.params.displayName);
  
  if (err) {
    const status = err instanceof NotFoundError ? 404 : 500;
    error(status, { message: err.message });
  }
  
  return { profile: data };
}
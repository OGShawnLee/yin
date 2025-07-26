import FollowDAO from "@db/dao/FollowDAO";
import { error } from "@sveltejs/kit";

export async function load(event) {
  const { data, error: err } = await FollowDAO.getAllByFollower(event.params.displayName);
  
  if (err) {
    error(500, { message: err.message });
  }
  
  return { followingList: data };
}
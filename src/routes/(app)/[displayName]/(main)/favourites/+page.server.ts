import AuthClient from '@business/auth/AuthClient.js';
import FavouriteDAO from '@db/dao/FavouriteDAO';
import { error } from '@sveltejs/kit';

export async function load(event) {
  const { data, error: err } = await FavouriteDAO.getAll(
    event.params.displayName,
    await AuthClient.findAuthPayloadFromCookies(event.cookies)
  );

  if (err) {
    error(500, { message: err.message });
  }

  return { favouriteList: data };
}
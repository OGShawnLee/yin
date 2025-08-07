import AuthClient from '@business/auth/AuthClient.js';
import SearchSchema from '@business/schema/SearchSchema';
import PostDAO from '@db/dao/PostDAO';
import { UserDAO } from '@db/dao/UserDAO.js';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

export async function load(event) {
  const form = await superValidate(
    event.url.searchParams,
    valibot(SearchSchema.SEARCH_SCHEMA)
  );

  if (form.valid && form.data.query) {
    const currentUser = await AuthClient.findAuthPayloadFromCookies(event.cookies);
    const [postRes, userRes] = await Promise.all([
      PostDAO.searchMany(form.data.query, currentUser),
      UserDAO.searchMany(form.data.query, currentUser),
    ]);

    if (postRes.error) {
      error(500, { message: postRes.error.message });
    }

    if (userRes.error) {
      error(500, { message: userRes.error.message });
    }

    return { form, postList: postRes.data, userList: userRes.data, query: form.data.query };
  }

  return { form, postList: [], userList: [], query: form.data.query };
}
import AuthClient from '@business/auth/AuthClient';
import PostSchema from '@business/schema/PostSchema';
import PostDAO from '@db/dao/PostDAO';
import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

export async function load(event) {
  return {
    currentUser: await AuthClient.getAuthPayloadFromCookies(event.cookies),
    form: await superValidate(valibot(PostSchema.INSERT_POST_SCHEMA))
  };
}

export const actions = {
  async default(event) {
    const form = await superValidate(event, valibot(PostSchema.INSERT_POST_SCHEMA));

    if (form.valid) {
      const user = await AuthClient.getAuthPayloadFromCookies(event.cookies);
      const { error: err } = await PostDAO.createOne(form.data, user);

      if (err) {
        error(500, { message: err.message });
      }

      redirect(302, '/');
    }

    return { form };
  }
};
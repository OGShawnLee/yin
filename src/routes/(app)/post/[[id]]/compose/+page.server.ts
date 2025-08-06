import AuthClient from '@business/auth/AuthClient';
import PostSchema from '@business/schema/PostSchema';
import type { Result } from '@common/ErrorHandler';
import type UserDisplayableError from '@common/UserDisplayableError';
import PostDAO from '@db/dao/PostDAO';
import QuoteDAO from '@db/dao/QuoteDAO';
import NotFoundError from '@db/NotFoundError';
import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

export async function load(event) {
  const currentUser = await AuthClient.getAuthPayloadFromCookies(event.cookies);

  console.log(currentUser);

  if (event.params.id) {
    const { data, error: err } = await PostDAO.getOne(event.params.id);

    if (err) {
      const status = err instanceof NotFoundError ? 404 : 500;
      error(status, { message: err.message });
    }

    return {
      quoteOf: data,
      currentUser,
      form: await superValidate(
        valibot(currentUser.isPro ? PostSchema.PRO_INSERT_POST_SCHEMA : PostSchema.INSERT_POST_SCHEMA)
      )
    }
  }

  return {
    quoteOf: null,
    currentUser,
    form: await superValidate(
      valibot(currentUser.isPro ? PostSchema.PRO_INSERT_POST_SCHEMA : PostSchema.INSERT_POST_SCHEMA)
    )
  };
}

export const actions = {
  async default(event) {
    const user = await AuthClient.getAuthPayloadFromCookies(event.cookies);
    const form = await superValidate(event, valibot(
      user.isPro ? PostSchema.PRO_INSERT_POST_SCHEMA : PostSchema.INSERT_POST_SCHEMA
    ));

    if (form.valid) {

      let result: Result<{ id: string }, UserDisplayableError>;

      if (event.params.id) {
        console.log("Quoting post with ID:", event.params.id);
        result = await QuoteDAO.createOne(event.params.id, form.data, user);
      } else {
        result = await PostDAO.createOne(form.data, user);
      }

      if (result.error) {
        error(500, { message: result.error.message });
      }

      redirect(302, '/post/' + result.data.id);
    }

    return { form };
  }
};
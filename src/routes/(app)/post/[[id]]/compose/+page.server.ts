import type { Result } from '@common/ErrorHandler';
import type UserDisplayableError from '@common/UserDisplayableError';
import AuthClient from '@business/auth/AuthClient';
import EditDAO from '@db/dao/EditDAO';
import PostDAO from '@db/dao/PostDAO';
import PostSchema from '@business/schema/PostSchema';
import QuoteDAO from '@db/dao/QuoteDAO';
import NotFoundError from '@db/NotFoundError';
import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

export async function load(event) {
  const currentUser = await AuthClient.getAuthPayloadFromCookies(event.cookies);
  const SCHEMA = valibot(currentUser.isPro ? PostSchema.PRO_INSERT_POST_SCHEMA : PostSchema.INSERT_POST_SCHEMA);
  const isEdit = event.url.searchParams.has('edit');

  if (event.params.id) {
    const { data, error: err } = await PostDAO.getOne(event.params.id);

    if (err) {
      const status = err instanceof NotFoundError ? 404 : 500;
      error(status, { message: err.message });
    }

    if (isEdit) {
      if (data.user.displayName !== currentUser.displayName) {
        error(403, { message: 'You are not allowed to edit this post.' });
      }

      return {
        currentUser,
        quoteOf: data.quoteOf,
        form: await superValidate(SCHEMA, { defaults: { content: data.content } })
      }
    }

    return { currentUser, form: await superValidate(SCHEMA), quoteOf: data };
  }

  return { currentUser, quoteOf: null, form: await superValidate(SCHEMA) };
}

export const actions = {
  async default(event) {
    const user = await AuthClient.getAuthPayloadFromCookies(event.cookies);
    const form = await superValidate(event, valibot(
      user.isPro ? PostSchema.PRO_INSERT_POST_SCHEMA : PostSchema.INSERT_POST_SCHEMA
    ));
    const isEdit = event.url.searchParams.has('edit');

    if (form.valid) {
      let result: Result<{ id: string }, UserDisplayableError>;

      if (event.params.id) {
        const fn = isEdit ? PostDAO.updateOne : QuoteDAO.createOne;
        result = await fn(event.params.id, form.data, user);
      } else {
        result = await PostDAO.createOne(form.data, user);
      }

      if (result.error) {
        const status = result.error instanceof NotFoundError ? 404 : 500;
        error(status, { message: result.error.message });
      }

      redirect(302, '/post/' + result.data.id);
    }

    return { form };
  }
};
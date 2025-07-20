import AuthClient from '@business/auth/AuthClient';
import AuthSchema from '@business/schema/AuthSchema';
import AccountDAO from '@db/dao/AccountDAO';
import { error, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

export async function load() {
  return {
    form: await superValidate(valibot(AuthSchema.SIGN_IN_SCHEMA))
  };
}

export const actions = {
  async default(event) {
    const form = await superValidate(event, valibot(AuthSchema.SIGN_IN_SCHEMA));

    if (form.valid) {
      const { data: account, error: err } = await AccountDAO.findOneByUserDisplayName(form.data.displayName);

      if (err) {
        error(500, { message: err.message });
      }

      if (account === null) {
        return setError(form, 'displayName', 'There is no Account with this username.');
      }

      if (await account.hasPasswordMatch(form.data.password)) {
        AuthClient.signIn(event.cookies, account.toCurrentUser(), account.refreshTokenVersion);
        redirect(302, '/');
      }

      return setError(form, 'password', 'La contraseña es incorrecta.');
    }

    return { form };
  }
};
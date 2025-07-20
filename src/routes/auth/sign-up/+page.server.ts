import AuthSchema from '@business/schema/AuthSchema';
import { error, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { UserDAO } from '@db/dao/UserDAO';
import ConstraintError from '@common/ConstraintError';

export async function load() {
  return {
    form: await superValidate(valibot(AuthSchema.SIGN_UP_SCHEMA))
  };
}

export const actions = {
  async default(event) {
    const form = await superValidate(event, valibot(AuthSchema.SIGN_UP_SCHEMA));

    if (form.valid) {
      if (form.data.password !== form.data.confirmPassword) {
        return setError(form, 'confirmPassword', 'The passwords do not match.');
      }

      const { error: err } = await UserDAO.createOne(form.data);

      if (err) {
        if (err instanceof ConstraintError) {
          if (err.field === 'email') {
            return setError(form, 'email', 'This email is already in use. Please try another one.');
          }

          if (err.field === 'displayName') {
            return setError(form, 'displayName', 'This display name is already in use. Please try another one.');
          }
        }

        error(500, { message: err.message });
      }

      redirect(302, '/auth/sign-in');
    }
  }
};
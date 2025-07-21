import AuthClient from "@business/auth/AuthClient";
import NotFoundError from "@db/NotFoundError";
import UserSchema from "@business/schema/UserSchema";
import { UserDAO } from "@db/dao/UserDAO";
import { error, redirect } from "@sveltejs/kit";
import { fail, superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";

export async function load(event) {
  const user = await AuthClient.getAuthPayloadFromCookies(event.cookies);
  const profile = await UserDAO.getOne(user.displayName);
  
  if (profile.error) {
    const status = profile.error instanceof NotFoundError ? 404 : 500;
    error(status, { message: profile.error.message });
  }

  return {
    form: await superValidate(valibot(UserSchema.UPDATE_USER_SCHEMA), {
      defaults: profile.data,
    }),
    profile: profile.data
  }
}

export const actions = {
  async default(event) {
    const form = await superValidate(event, valibot(UserSchema.UPDATE_USER_SCHEMA));

    if (form.valid) {
      const user = await AuthClient.getAuthPayloadFromCookies(event.cookies);
      const { error: err } = await UserDAO.updateOne(user.displayName, form.data);
    
      if (err) {
        error(500, { message: err.message });
      }

      redirect(302, "/" + user.displayName);
    }

    return fail(400, { form });
  }
}
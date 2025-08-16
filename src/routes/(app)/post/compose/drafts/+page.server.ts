import AuthClient from '@business/auth/AuthClient';
import Schema from '@business/schema/Schema';
import DraftDAO from '@db/dao/DraftDAO';
import { error } from "@sveltejs/kit";
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

export async function load(event) {
  const currentUser = await AuthClient.getAuthPayloadFromCookies(event.cookies);
  const { data, error: err } = await DraftDAO.getAll(currentUser);

  if (err) {
    error(500, { message: err.message });
  }

  return { draftList: data };
}

export const actions = {
  "delete-draft": async (event) => {
    const currentUser = await AuthClient.getAuthPayloadFromCookies(event.cookies);
    const form = await superValidate(event, valibot(Schema.ID_OBJECT_SCHEMA));

    if (form.valid) {
      const { error: err } = await DraftDAO.deleteOne(form.data.id, currentUser);
      
      if (err) {
        error(500, { message: err.message });
      }
    }

    return { form };
  }
}
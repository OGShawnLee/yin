import type ComposeStateShape from "@business/controller/ComposeStateShape";
import type ComposeController from "@business/controller/ComposeController";
import DraftDAO from "@db/dao/DraftDAO";
import NotFoundError from "@db/NotFoundError";
import { superValidate } from "sveltekit-superforms";
import { error, redirect } from "@sveltejs/kit";

export default class ComposeEditDraftState implements ComposeStateShape {
  public constructor(
    private readonly context: ComposeController,
    private readonly id: string
  ) { }

  public async load() {
    const { data, error: err } = await DraftDAO.getOne(this.id, this.context.currentUser);

    if (data) {
      return {
        quoteOf: data.quoteOf,
        currentUser: this.context.currentUser,
        form: await superValidate(this.context.INSERT_SCHEMA, {
          defaults: { content: data.content ?? "" }
        }),
        state: this.context.state
      };
    }

    const status = err instanceof NotFoundError ? 404 : 500;
    error(status, { message: err.message });
  }

  public async handleCreateDraftAction() {
    const form = await superValidate(this.context.event, this.context.INSERT_SCHEMA);

    if (form.valid) {
      const { error: err } = await DraftDAO.updateOne(this.id, form.data, this.context.currentUser);

      if (err) error(500, { message: err.message });

      redirect(302, this.context.getEditDraftPath(this.id));
    }

    return { form };
  }

  public async handleCreatePostAction() {
    const form = await superValidate(this.context.event, this.context.INSERT_SCHEMA);

    if (form.valid) {
      const { data, error: err } = await DraftDAO.publishOne(this.id, form.data, this.context.currentUser);

      if (err) error(500, { message: err.message });

      this.context.redirectToPostPage(data.id);
    }

    return { form };
  }
}
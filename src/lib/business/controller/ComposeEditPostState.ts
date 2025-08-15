import type ComposeStateShape from "@business/controller/ComposeStateShape";
import type ComposeController from "./ComposeController";
import PostDAO from "@db/dao/PostDAO";
import NotFoundError from "@db/NotFoundError";
import UserDisplayableError from "@common/UserDisplayableError";
import { superValidate } from "sveltekit-superforms";
import { error } from "@sveltejs/kit";

export default class ComposeEditPostState implements ComposeStateShape {
  public constructor(
    private readonly context: ComposeController,
    private readonly id: string
  ) { }

  public async load() {
    const { data, error: err } = await PostDAO.getOne(this.id, this.context.currentUser);

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
    throw new UserDisplayableError("Creating a Draft from a Post update is not supported yet.");
    const form = await superValidate(this.context.event, this.context.INSERT_SCHEMA);
    return { form };
  }

  public async handleCreatePostAction() {
    const form = await superValidate(this.context.event, this.context.INSERT_SCHEMA);

    if (form.valid) {
      const { data, error: err } = await PostDAO.updateOne(this.id, form.data, this.context.currentUser);

      if (err) error(500, { message: err.message });

      this.context.redirectToPostPage(data.id);
    }

    return { form };
  }
}
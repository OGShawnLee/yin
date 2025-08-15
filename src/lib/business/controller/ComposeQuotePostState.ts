import type ComposeStateShape from "@business/controller/ComposeStateShape";
import type ComposeController from "./ComposeController";
import DraftDAO from "@db/dao/DraftDAO";
import PostDAO from "@db/dao/PostDAO";
import QuoteDAO from "@db/dao/QuoteDAO";
import NotFoundError from "@db/NotFoundError";
import { superValidate } from "sveltekit-superforms";
import { error, redirect } from "@sveltejs/kit";

export default class ComposeQuotePostState implements ComposeStateShape {
  public constructor(
    private readonly context: ComposeController,
    private readonly quoteOf: string
  ) { }

  public async load() {
    const { data, error: err } = await PostDAO.getOne(this.quoteOf, this.context.currentUser);

    if (data) {
      return {
        quoteOf: data,
        currentUser: this.context.currentUser,
        form: await superValidate(this.context.INSERT_SCHEMA),
        state: this.context.state
      };
    }

    const status = err instanceof NotFoundError ? 404 : 500;
    error(status, { message: err.message });
  }

  public async handleCreateDraftAction() {
    const form = await superValidate(this.context.event, this.context.INSERT_SCHEMA);

    if (form.valid) {
      const { data, error: err } = await DraftDAO.createOne(form.data, this.quoteOf, this.context.currentUser);

      if (err) error(500, { message: err.message });

      redirect(302, this.context.getEditDraftPath(data.id));

      return { form };
    }

    return { form };
  }

  public async handleCreatePostAction() {
    const form = await superValidate(this.context.event, this.context.INSERT_SCHEMA);

    if (form.valid) {
      const { data, error: err } = await QuoteDAO.createOne(this.quoteOf, form.data, this.context.currentUser);

      if (err) error(500, { message: err.message });

      this.context.redirectToPostPage(data.id);
    }

    return { form };
  }  
}
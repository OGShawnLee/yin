import type ComposeStateShape from "@business/controller/ComposeStateShape";
import type ComposeController from "./ComposeController";
import DraftDAO from "@db/dao/DraftDAO";
import PostDAO from "@db/dao/PostDAO";
import { superValidate } from "sveltekit-superforms";
import { error, redirect } from "@sveltejs/kit";

export default class ComposeCreatePostState implements ComposeStateShape {
  public constructor(
    private readonly context: ComposeController,
  ) { }

  public async load() {    
    return { 
      quoteOf: null, 
      currentUser: this.context.currentUser, 
      form: await superValidate(this.context.INSERT_SCHEMA), 
      state: this.context.state
    };
  }

  public async handleCreateDraftAction() {
    const form = await superValidate(this.context.event, this.context.INSERT_SCHEMA);

    if (form.valid) {
      const { data, error: err } = await DraftDAO.createOne(form.data, undefined, this.context.currentUser);

      if (err) error(500, { message: err.message });

      redirect(302, this.context.getEditDraftPath(data.id));

      return { form };
    }

    return { form };
  }

  public async handleCreatePostAction() {
    const form = await superValidate(this.context.event, this.context.INSERT_SCHEMA);

    if (form.valid) {
      const { data, error: err } = await PostDAO.createOne(form.data, this.context.currentUser);

      if (err) error(500, { message: err.message });

      this.context.redirectToPostPage(data.id);
    }

    return { form };
  }
}
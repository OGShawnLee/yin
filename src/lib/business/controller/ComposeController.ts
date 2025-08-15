import type ComposeStateShape from "@business/controller/ComposeStateShape";
import type { CurrentUserShape } from "@business/schema/AuthSchema";
import type { RequestEvent, ServerLoadEvent } from "@sveltejs/kit";
import AuthClient from "@business/auth/AuthClient";
import PostSchema from "@business/schema/PostSchema";
import ErrorHandler from "@common/ErrorHandler";
import UserDisplayableError from "@common/UserDisplayableError";
import ComposeSchema, { ComposeState } from "@business/schema/ComposeSchema";
import ComposeCreatePostState from "@business/controller/ComposeCreatePostState";
import ComposeQuotePostState from "@business/controller/ComposeQuotePostState";
import ComposeEditDraftState from "@business/controller/ComposeEditDraftState";
import ComposeEditPostState from "@business/controller/ComposeEditPostState";
import { error, redirect } from "@sveltejs/kit";
import { valibot } from "sveltekit-superforms/adapters";
import { format } from "$lib";

export default class ComposeController {
  private readonly currentState: ComposeStateShape;
  
  private constructor(
    public readonly event: ServerLoadEvent | RequestEvent,
    public readonly id: string | undefined,
    public readonly currentUser: CurrentUserShape,
    public readonly INSERT_SCHEMA = ComposeController.getInsertSchema(currentUser),
    public readonly state = ComposeSchema.getValidComposeURLSearchParams({
      state: event.url.searchParams.get("state")
    }).state
  ) {
    switch (state) {
      case ComposeState.CREATE:
        this.currentState = new ComposeCreatePostState(this);
        break;
      case ComposeState.QUOTE:
        if (id === undefined) throw new UserDisplayableError("Post ID is required for quoting a Post.");
        this.currentState = new ComposeQuotePostState(this, id);
        break;
      case ComposeState.EDIT_DRAFT:
        if (id === undefined) throw new UserDisplayableError("Draft ID is required for editing a Draft.");
        this.currentState = new ComposeEditDraftState(this, id);
        break;
      case ComposeState.EDIT_POST:
        if (id === undefined) throw new UserDisplayableError("Post ID is required for editing a Post.");
        this.currentState = new ComposeEditPostState(this, id);
        break;
      default:
        throw new Error("Invalid Compose State.");
    }
  }

  public static async create(event: RequestEvent, id: string | undefined) {
    const currentUser = await AuthClient.getAuthPayloadFromCookies(event.cookies);
    const { data, error: err } = await ErrorHandler.useAwait(async () => {
      return new ComposeController(event, id, currentUser);
    });

    if (err) {
      error(500, { message: err.message });
    }

    return data;
  }

  private static getInsertSchema(currentUser: CurrentUserShape) {
    return valibot(currentUser.isPro ? PostSchema.PRO_INSERT_POST_SCHEMA : PostSchema.INSERT_POST_SCHEMA);
  }

  public static async load(event: ServerLoadEvent, id: string | undefined) {
    const controller = await this.create(event, id);

    return controller.currentState.load();
  }

  public handleCreateDraftAction() {
    return this.currentState.handleCreateDraftAction();
  }

  public handleCreatePostAction() {
    return this.currentState.handleCreatePostAction();
  }

  public readonly CREATE_PATH = "/post/compose?state=CREATE";
  
  public getQuotePath(id: string) {
    return format("/post/{0}/compose?state=QUOTE", id);
  }

  public getEditPath(id: string) {
    return format("/post/{0}/compose?state=EDIT_POST", id);
  }

  public getEditDraftPath(id: string) {
    return format("/post/{0}/compose?state=EDIT_DRAFT", id);
  }

  public redirectToPostPage(id: string) {
    redirect(302, "/post/" + id);
  }
}
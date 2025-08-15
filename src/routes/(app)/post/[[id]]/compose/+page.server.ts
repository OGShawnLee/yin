import ComposeStateContext from '@business/controller/ComposeController';

// post/compose?state=CREATE -> Create Post
// -> actions: create-post | create-draft
// post/{id}/compose?state=QUOTE -> Create with Quote 
// -> actions: create-post | create-draft 
// post/{id}/compose?state=EDIT -> Edit Post
// post/{id}/compose?state=EDIT_DRAFT -> Edit Draft

export async function load(event) {
  return await ComposeStateContext.load(event, event.params.id);
}

export const actions = {
  // post/compose/?state=CREATE
  // post/{id}/compose/?state=QUOTE
  // post/{id}/compose/?state=EDIT -> Invalid (Saving a Draft of an Edit is not supported)
  // post/{id}/compose/?state=EDIT_DRAFT
  "create-draft": async (event) => {
    const controller = await ComposeStateContext.create(event, event.params.id);

    // console.log("create-draft", controller.state);

    return await controller.handleCreateDraftAction();

    // const user = await AuthClient.getAuthPayloadFromCookies(event.cookies);
    // const form = await superValidate(event, valibot(
    //   user.isPro ? PostSchema.PRO_INSERT_POST_SCHEMA : PostSchema.INSERT_POST_SCHEMA
    // ));

    // if (form.valid) {
    //   const { data, error: err } = await DraftDAO.createOne(form.data, user);

    //   if (err) {
    //     error(500, { message: err.message });
    //   }

    //   redirect(302, '/post/' + data.id + '/compose?state=EDIT_DRAFT');
    // }

    // return { form };
  },
  "create-post": async (event) => {
    const controller = await ComposeStateContext.create(event, event.params.id);
    
    // console.log("create-post", controller.state);

    return controller.handleCreatePostAction(); 


    // return await controller.handleCreatePostAction();
    // const user = await AuthClient.getAuthPayloadFromCookies(event.cookies);
    // const form = await superValidate(event, valibot(
    //   user.isPro ? PostSchema.PRO_INSERT_POST_SCHEMA : PostSchema.INSERT_POST_SCHEMA
    // ));
    // const isEdit = event.url.searchParams.has('edit');

    // if (form.valid) {
    //   let result: Result<{ id: string }, UserDisplayableError>;

    //   if (event.params.id) {
    //     const fn = isEdit ? PostDAO.updateOne : QuoteDAO.createOne;
    //     result = await fn(event.params.id, form.data, user);
    //   } else {
    //     result = await PostDAO.createOne(form.data, user);
    //   }

    //   if (result.error) {
    //     const status = result.error instanceof NotFoundError ? 404 : 500;
    //     error(status, { message: result.error.message });
    //   }

    //   redirect(302, '/post/' + result.data.id);
    // }

    // return { form };
  }
};
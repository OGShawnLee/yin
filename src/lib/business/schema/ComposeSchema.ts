import { nullable, object, parse, picklist } from "valibot";

export enum ComposeState {
  CREATE = "CREATE",
  QUOTE = "QUOTE",
  EDIT_POST = "EDIT_POST",
  EDIT_DRAFT = "EDIT_DRAFT"
}

export default class ComposeSchema {
  private static URL_PARAMS_SCHEMA = object({
    "state": (
      picklist([
        ComposeState.CREATE,
        ComposeState.QUOTE,
        ComposeState.EDIT_POST,
        ComposeState.EDIT_DRAFT
      ])
    )
  });

  public static getValidComposeURLSearchParams(data: unknown) {
    return parse(this.URL_PARAMS_SCHEMA, data);
  }
}
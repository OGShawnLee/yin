import type PostSchema from "@business/schema/PostSchema";
import type { CurrentUserShape } from "@business/schema/AuthSchema";
import type { ShallowPostShape } from "@business/schema/PostSchema";
import type { SuperValidated } from "sveltekit-superforms";
import type { InferOutput } from "valibot";
import type { ComposeState } from "@business/schema/ComposeSchema";

export default interface ComposeStateShape {
  load(): Promise<{
    quoteOf: ShallowPostShape | null,
    currentUser: CurrentUserShape,
    form: SuperValidated<InferOutput<typeof PostSchema.INSERT_POST_SCHEMA>>
    state: ComposeState
  }>;
  handleCreateDraftAction(): Promise<{
    form: SuperValidated<InferOutput<typeof PostSchema.INSERT_POST_SCHEMA>>
  }>
  handleCreatePostAction(): Promise<{
    form: SuperValidated<InferOutput<typeof PostSchema.INSERT_POST_SCHEMA>>
  }>;
}
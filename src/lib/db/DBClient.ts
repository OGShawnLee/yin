import type { CurrentUserShape } from "@business/schema/AuthSchema";
import { Client, createClient } from "gel";

let DBClient: Client;

export function getClient(currentUser?: CurrentUserShape | null) {
  if (currentUser) {
    return createClient().withGlobals({ currentUserDisplayName: currentUser.displayName });
  }

  return DBClient ? DBClient : (DBClient = createClient());
}

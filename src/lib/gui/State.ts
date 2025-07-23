import type { CurrentUserShape } from "@business/schema/AuthSchema";
import { getContext, setContext } from "svelte";
import type { Writable } from "svelte/store";
import { writable } from "svelte/store";

export function createGlobalState<State>(name: string) {
  return {
    mount(value: State) {
      const state = writable(value);
      return setContext(name, state);
    },
    getContext() {
      return getContext(name) as Writable<State>;
    }
  };
}

export const CurrentUserState = createGlobalState<CurrentUserShape | null>("currentUserState");
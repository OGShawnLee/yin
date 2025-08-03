<script lang="ts">
  import { Lightning, SketchLogo, OrangeSlice } from "phosphor-svelte";

  export let kind: "Founder" | "Pro" | "Staff";

  const ICONS = {
    Founder: Lightning,
    Pro: SketchLogo,
    Staff: OrangeSlice,
  };
</script>

<div class="h-6 px-2 flex items-center gap-1 border rounded-md border-pro text-pro">
  <svelte:component this={ICONS[kind]} class={kind === 'Staff' ? 'transform rotate-45 text-current' : 'text-current'} weight="bold" />
  <span class="text-xs font-bold uppercase">{kind}</span>
</div>

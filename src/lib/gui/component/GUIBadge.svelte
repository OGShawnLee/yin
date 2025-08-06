<script lang="ts">
	import { Lightning, SketchLogo, OrangeSlice } from 'phosphor-svelte';

	export let kind: 'Founder' | 'Pro' | 'Staff';
	export let small = false;

	const ICONS = {
		Founder: Lightning,
		Pro: SketchLogo,
		Staff: OrangeSlice
	};
</script>

{#if small}
	<div class="size-6 min-w-4 flex items-center justify-center border rounded-md border-pro text-pro">
		<svelte:component this={ICONS[kind]} class="text-current" size={16} />
		<span class="sr-only">{kind}</span>
	</div>
{:else}
	<div class="h-6 px-2 flex items-center gap-1 border rounded-md border-pro text-pro">
		<svelte:component
			this={ICONS[kind]}
			class={kind === 'Staff' ? 'transform rotate-45 text-current' : 'text-current'}
			weight="bold"
		/>
		<span class="text-xs font-bold uppercase">{kind}</span>
	</div>
{/if}

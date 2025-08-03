<script lang="ts">
	import GUIUserHeader from '@gui/component/GUIUserHeader.svelte';

	export let name: string;
	export let displayName: string;
	export let description: string | null;
</script>

<article class="px-8 py-4 grid gap-2 border-b-2 border-inactive">
	<GUIUserHeader {name} {displayName} />
	{#if description}
		<p class="leading-relaxed whitespace-pre-line">{description}</p>
	{/if}
</article>

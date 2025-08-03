<script lang="ts">
	import GUIUserHeader from '@gui/component/GUIUserHeader.svelte';
	import GUIBadgeList from '@gui/component/GUIBadgeList.svelte';

	export let name: string;
	export let displayName: string;
	export let description: string | null;
	export let isPro: boolean;
	export let isFounder: boolean;
	export let isStaff: boolean;
</script>

<article class="px-8 py-4 grid gap-4 border-b-2 border-inactive">
	<GUIUserHeader {name} {displayName} />
	<GUIBadgeList {isPro} {isFounder} {isStaff} />
	{#if description}
		<p class="leading-relaxed whitespace-pre-line">{description}</p>
	{/if}
</article>

<script lang="ts">
	import GUIUserHeader from '@gui/component/GUIUserHeader.svelte';
	import GUIBadgeList from '@gui/component/GUIBadgeList.svelte';

	export let id: string;
	export let name: string;
	export let displayName: string;
	export let description: string | null;
	export let isPro: boolean;
	export let isFounder: boolean;
	export let isStaff: boolean;
</script>

<article class="p-8 grid gap-4 bordered-b">
	<GUIUserHeader user={{ id, name, displayName, isPro }} badge={false} />
	<GUIBadgeList {isPro} {isFounder} {isStaff} />
	{#if description}
		<p class="leading-relaxed whitespace-pre-line">{description}</p>
	{/if}
</article>

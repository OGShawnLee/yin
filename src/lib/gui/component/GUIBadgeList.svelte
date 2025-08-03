<script lang="ts">
	import GUIBadge from '@gui/component/GUIBadge.svelte';

	export let isFounder: boolean;
	export let isPro: boolean;
	export let isStaff: boolean;
</script>

{#if isFounder || isPro || isStaff}
	<div class="flex items-center gap-2">
		{#if isFounder}
			<GUIBadge kind="Founder" />
		{/if}
		{#if isStaff}
			<GUIBadge kind="Staff" />
		{/if}
		{#if isPro}
			<GUIBadge kind="Pro" />
		{/if}
	</div>
{/if}

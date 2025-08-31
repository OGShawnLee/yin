<script lang="ts">
	import type { CurrentUserShape } from '@business/schema/AuthSchema';
	import GUIBadge from '@gui/component/GUIBadge.svelte';

	export let user: CurrentUserShape;
	export let link = true;
	export let badge = true;
</script>

<div class="grid">
	<div class="flex items-center gap-2">
		<p class="text-lg #text-summit font-bold leading-tight">{user.name}</p>
		{#if user.isPro && badge}
			<GUIBadge kind="Pro" small />
		{/if}
	</div>
	{#if link}
		<a class="w-fit text-xs text-side font-bold leading-tight" href="/{user.displayName}">
			@{user.displayName}
		</a>
	{:else}
		<p class="text-xs text-side font-bold leading-tight">
			@{user.displayName}
		</p>
	{/if}
</div>

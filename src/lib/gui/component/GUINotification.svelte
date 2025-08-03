<script lang="ts">
	import type { NotificationShape } from '@business/schema/NotificationSchema';
	import GUIDateTime from '@gui/component/GUIDateTime.svelte';
	import { Heart, UserPlus } from 'phosphor-svelte';

	export let notification: NotificationShape;
</script>

<div class="px-8 py-4 flex items-start gap-2 border-b border-inactive">
	<div class="size-10 min-w-10 flex items-center justify-center">
		<svelte:component
			this={notification.kind === 'Follow' ? UserPlus : Heart}
			class="text-white"
			size={28}
		/>
	</div>
	<div class="grid gap-2">
		<p class="font-bold">
			<a class="underline underline-offset-4" href="/{notification.from.displayName}">
				{notification.from.name}
				<span class="text-side">
					(@{notification.from.displayName})
				</span>
			</a>
			{#if notification.kind === 'Favourite'}
				liked your
				<a class="underline underline-offset-4" href="/post/{notification.post?.id}"> Post </a>.
			{:else if notification.kind === 'Follow'}
				started following you.
			{/if}
		</p>
		<GUIDateTime createdAt={notification.createdAt} />
	</div>
</div>

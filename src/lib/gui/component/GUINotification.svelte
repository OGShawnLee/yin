<script lang="ts">
	import type { NotificationShape } from '@business/schema/NotificationSchema';
	import GUIDateTime from '@gui/component/GUIDateTime.svelte';
	import { Heart, Recycle, Quotes, UserPlus } from 'phosphor-svelte';

	export let notification: NotificationShape;

	const NOTIFICATION_KIND_ICONS = {
		Favourite: Heart,
		Follow: UserPlus,
		Repost: Recycle,
		Quote: Quotes
	};	
</script>

<div class="px-8 py-4 flex items-start gap-2 border-b border-inactive text-white">
	<div class="size-10 min-w-10 flex items-center justify-center">
		<svelte:component
			this={NOTIFICATION_KIND_ICONS[notification.kind]}
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
			{:else}
				reposted your
				<a class="underline underline-offset-4" href="/post/{notification.post?.id}"> Post </a>.
			{/if}
		</p>
		<GUIDateTime createdAt={notification.createdAt} />
	</div>
</div>

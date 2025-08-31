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

<div class="p-8 flex items-start gap-2 bordered-b">
	<div class="size-10 min-w-10 flex items-center justify-center">
		<svelte:component
			this={NOTIFICATION_KIND_ICONS[notification.kind]}
			class="#text-summit"
			size={28}
		/>
	</div>
	<div class="grid gap-4">
		<p>
			<a class="font-bold" href="/{notification.from.displayName}">
				{notification.from.name}
				<span class="text-side-light dark:text-side">
					(@{notification.from.displayName})
				</span>
			</a>
			{#if notification.kind === 'Favourite'}
				liked your
				<a class="font-bold" href="/post/{notification.post?.id}"> Post </a>.
			{:else if notification.kind === 'Follow'}
				started following you.
			{:else if notification.kind === 'Repost'}
				reposted your
				<a class="font-bold" href="/post/{notification.post?.id}"> Post </a>.
			{:else if notification.kind === 'Quote'}
				quoted your
				<a class="font-bold" href="/post/{notification.post?.id}"> Post </a>.
			{/if}
		</p>
		<GUIDateTime createdAt={notification.createdAt} />
	</div>
</div>

<script lang="ts">
	import type { NotificationShape } from '@business/schema/NotificationSchema';
	import GUIBottomMobileNavBar from '@gui/component/GUIBottomMobileNavBar.svelte';
	import GUIMobileMenu from '@gui/layout/GUIMobileMenu.svelte';
	import GUINotification from '@gui/component/GUINotification.svelte';
	import GUITopHeader from '@gui/component/GUITopHeader.svelte';

	export let data: { notificationList: NotificationShape[] };
</script>

<svelte:head>
	<title>Notifications - Yin</title>
</svelte:head>

<main class="py-20">
	<GUITopHeader title="Notifications">
		<GUIMobileMenu slot="button" />
	</GUITopHeader>
	<section>
		<h2 class="sr-only">Recent Notifications</h2>
		<ul>
			{#each data.notificationList as notification (notification.id)}
				<GUINotification {notification} />
			{/each}
		</ul>
	</section>
</main>

<GUIBottomMobileNavBar route="Notifications" />

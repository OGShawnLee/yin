<script lang="ts">
	import type { CurrentUserShape } from '@business/schema/AuthSchema';
	import type { PostShape } from '@business/schema/PostSchema';
	import GUIPostCard from '@gui/GUIPostCard.svelte';

	export let data: { bookmarkList: { id: string, post: PostShape }[], currentUser: CurrentUserShape };
</script>

<svelte:head>
	<title>Bookmarks - Yin</title>
</svelte:head>

<main class="p-20 grid gap-4">
	<header class="h-20 p-4 border-b border-neutral-900">
		<h1 class="heading-1">Bookmarks</h1>
		<p class="text-sm text-neutral-400">@{data.currentUser.displayName}</p>
	</header>
	<section>
		<h2 class="sr-only">Recent Bookmarks</h2>
		<ul>
			{#each data.bookmarkList as bookmark (bookmark.id)}
				<GUIPostCard post={bookmark.post} />
			{/each}
		</ul>
	</section>
</main>

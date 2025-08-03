<script lang="ts">
	import type { CurrentUserShape } from '@business/schema/AuthSchema';
	import type { PostShape } from '@business/schema/PostSchema';
	import GUIPostCard from '@gui/component/GUICardPost.svelte';
	import GUITopHeader from '@gui/component/GUITopHeader.svelte';
	import GUIBottomMobileNavBar from '@gui/component/GUIBottomMobileNavBar.svelte';

	export let data: {
		bookmarkList: { id: string; post: PostShape }[];
		currentUser: CurrentUserShape;
	};
</script>

<svelte:head>
	<title>Bookmarks - Yin</title>
</svelte:head>

<main class="py-20 xl:(grid gap-4)">
	<GUITopHeader title="Bookmarks" />
	<section>
		<h2 class="sr-only">Recent Bookmarks</h2>
		<ul>
			{#each data.bookmarkList as bookmark (bookmark.post.id)}
				<GUIPostCard post={bookmark.post} />
			{/each}
		</ul>
	</section>
</main>

<GUIBottomMobileNavBar route="Bookmarks" />
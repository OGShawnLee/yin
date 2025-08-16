<script lang="ts">
	import type { PostShape } from '@business/schema/PostSchema';
	import GUIBottomMobileNavBar from '@gui/component/GUIBottomMobileNavBar.svelte';
	import GUIMobileMenu from '@gui/layout/GUIMobileMenu.svelte';
	import GUIPostCard from '@gui/component/GUICardPost.svelte';
	import GUITopHeader from '@gui/component/GUITopHeader.svelte';
	import { CurrentUserState } from '@gui/State';

	export let data: { postList: PostShape[] };

	const currentUser = CurrentUserState.getContext();
</script>

<svelte:head>
	<title>Home - Yin</title>
</svelte:head>

<main class="py-20">
	{#if $currentUser}
		<GUITopHeader title="Home" href="/" subtitle="Following" subhref="/following">
			<GUIMobileMenu slot="button" />
		</GUITopHeader>
	{:else}
		<GUITopHeader title="Home" href="/" />
	{/if}
	<section>
		<h2 class="sr-only">Recent Posts</h2>
		<ul>
			{#each data.postList as post (post.id)}
				<GUIPostCard {post} />
			{/each}
		</ul>
	</section>
</main>

<GUIBottomMobileNavBar route="Home" />

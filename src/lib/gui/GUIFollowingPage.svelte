<script lang="ts">
	import type { PostShape } from '@business/schema/PostSchema';
	import GUIBottomMobileNavBar from '@gui/component/GUIBottomMobileNavBar.svelte';
	import GUIMobileMenu from "@gui/layout/GUIMobileMenu.svelte";
	import GUIPostCard from '@gui/component/GUICardPost.svelte';
	import GUITopHeader from '@gui/component/GUITopHeader.svelte';

	export let data: { postList: PostShape[] };
</script>

<svelte:head>
	<title>Following - Yin</title>
</svelte:head>

<main class="py-20">
  <GUITopHeader title="Following" href="/following" subtitle="Home" subhref="/">
		<GUIMobileMenu slot="button"/>
	</GUITopHeader>
	<section>
		<h2 class="sr-only">Recent Posts</h2>
		<ul>
			{#each data.postList as post (post.id)}
				<GUIPostCard {post} />
			{/each}
		</ul>
	</section>
</main>

<GUIBottomMobileNavBar route="None" />

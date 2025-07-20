<script lang="ts">
	import type { PostShape } from '@business/schema/PostSchema';
	import GUIPostCard from '@gui/GUIPostCard.svelte';
	import DateFormatter from '@common/DateFormatter';

	export let data: { postList: PostShape[] };
</script>

<svelte:head>
	<title>Home - Yin</title>
</svelte:head>

<main class="p-20 grid gap-4">
	<header class="h-20 p-4 border-b border-neutral-900">
		<h1 class="heading-1">Home</h1>
	</header>
	<section>
		<h2 class="sr-only">Recent Posts</h2>
		<ul>
			{#each data.postList as post (post.id)}
				<GUIPostCard {post} />
			{/each}
		</ul>
	</section>
</main>

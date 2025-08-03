<script>
	import GUIPostCard from '@gui/component/GUICardPost.svelte';

	export let data;
</script>

<h2 class="sr-only">Recent Posts</h2>
<ul>
	{#each data.postList as post (post.id)}
		<GUIPostCard {post} />
	{/each}
</ul>

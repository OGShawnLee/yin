<script lang="ts">
	import type { PostShape } from '@business/schema/PostSchema';
	import GUICardPost from '@gui/component/GUICardPost.svelte';
	import GUITopHeader from '@gui/component/GUITopHeader.svelte';

	export let post: PostShape;
</script>

<svelte:head>
	<title>
		{post.user.name} on Yin "{post.content}" - Yin
	</title>
</svelte:head>

<main class="py-20 md:(grid gap-4)">
	<GUITopHeader title="Post" />
	<GUICardPost {post} />
</main>

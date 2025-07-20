<script lang="ts">
	import type { PostShape } from '@business/schema/PostSchema';
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
			{#each data.postList as post}
				<div class="grid gap-2 p-4 border-b border-neutral-900">
					<div>
						<p class="text-lg text-white font-medium">{post.author.name}</p>
						<p class="text-sm text-neutral-400">@{post.author.displayName}</p>
					</div>
					<p class="leading-relaxed">{post.content}</p>
					{#if post.createdAt}
						<time class="text-sm text-neutral-400" datetime={post.createdAt.toISOString()}>
							{DateFormatter.getFormattedDate(post.createdAt)} - {DateFormatter.getRelativeDate(
								post.createdAt
							)}
						</time>
					{/if}
				</div>
			{/each}
		</ul>
	</section>
</main>

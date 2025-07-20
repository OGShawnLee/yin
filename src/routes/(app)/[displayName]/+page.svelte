<script>
	import DateFormatter from '@common/DateFormatter';

	export let data;
</script>

<h2 class="sr-only">Recent Posts</h2>
<ul>
	{#each data.postList as post}
		<div class="grid gap-2 p-4 border-b border-neutral-900">
			<div>
				<p class="text-lg text-white font-medium">{post.author.name}</p>
				<a class="text-sm text-neutral-400" href="/{post.author.displayName}"
					>@{post.author.displayName}</a
				>
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

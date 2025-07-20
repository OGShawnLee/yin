<script lang="ts">
	import type { PostShape } from '@business/schema/PostSchema';
	import DateFormatter from '@common/DateFormatter';

	export let post: PostShape;
</script>

<div class="grid gap-2 p-4 border-b border-neutral-900">
	<div>
		<p class="text-lg text-white font-medium">{post.author.name}</p>
		<a class="text-sm text-neutral-400" href="/{post.author.displayName}">
			@{post.author.displayName}
		</a>
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

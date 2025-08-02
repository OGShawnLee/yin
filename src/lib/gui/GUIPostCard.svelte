<script lang="ts">
	import type { PostShape } from '@business/schema/PostSchema';
	import DateFormatter from '@common/DateFormatter';
	import { BookmarkSimple, Heart } from 'phosphor-svelte';
	import { enhance } from '$app/forms';

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
	<div class="pt-4 flex items-center gap-4">
		<form action="/post/{post.id}?/handle-bookmark" method="post" use:enhance>
			<button
				type="submit"
				class="flex items-center gap-2 text-xs text-neutral-400 hover:cursor-pointer hover:text-purple-400"
				aria-label="Bookmark Post"
			>
				<BookmarkSimple size={16} weight={post.isBookmarked ? "fill" : "regular"} />
				{#if post.bookmarkCount > 0}
					<p class="text-white font-medium">
						{post.bookmarkCount}
					</p>
				{/if}
				<p>Bookmark Post</p>
			</button>
		</form>
		<form action="/post/{post.id}?/handle-favourite" method="post" use:enhance>
			<button
				type="submit"
				class="flex items-center gap-2 text-xs text-neutral-400 hover:cursor-pointer hover:text-red-400"
				aria-label="Like Post"
			>
				<Heart size={16} weight={post.isFavourite ? "fill" : "regular"} />
				{#if post.favouriteCount > 0}
					<p class="text-white font-medium">
						{post.favouriteCount}
					</p>
				{/if}
				<p>Like Post</p>
			</button>
		</form>
	</div>
</div>

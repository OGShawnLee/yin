<script lang="ts">
	import type { PostShape } from '@business/schema/PostSchema';
	import GUIUserHeader from '@gui/component/GUIUserHeader.svelte';
	import GUIDateTime from '@gui/component/GUIDateTime.svelte';
	import DateFormatter from '@common/DateFormatter';
	import { BookmarkSimple, Heart } from 'phosphor-svelte';
	import { enhance } from '$app/forms';

	export let post: PostShape;
</script>

<div class="grid gap-4 py-4 px-8 border-b-2 border-neutral-900">
	<GUIUserHeader name={post.author.name} displayName={post.author.displayName} />
	<p class="leading-normal whitespace-pre-line">{post.content}</p>
	<GUIDateTime createdAt={post.createdAt} />
	<div class="flex items-center gap-4">
		<form action="/post/{post.id}?/handle-bookmark" method="post" use:enhance>
			<button
				type="submit"
				class="flex items-center gap-2 text-xs hover:cursor-pointer"
				class:text-white={post.isBookmarked}
				aria-label="Bookmark Post"
			>
				<BookmarkSimple
					class="text-current"
					size={16}
					weight={post.isBookmarked ? 'fill' : 'regular'}
				/>
				{#if post.bookmarkCount > 0}
					<p class="text-white font-black">
						{post.bookmarkCount}
					</p>
				{/if}
				<p class="text-common">Bookmark Post</p>
			</button>
		</form>
		<form action="/post/{post.id}?/handle-favourite" method="post" use:enhance>
			<button
				type="submit"
				class="flex items-center gap-2 text-xs hover:cursor-pointer"
				class:text-white={post.isFavourite}
				aria-label="Like Post"
			>
				<Heart class="text-current" size={16} weight={post.isFavourite ? 'fill' : 'regular'} />
				{#if post.favouriteCount > 0}
					<p class="text-white font-black">
						{post.favouriteCount}
					</p>
				{/if}
				<p class="text-common">Like Post</p>
			</button>
		</form>
	</div>
</div>

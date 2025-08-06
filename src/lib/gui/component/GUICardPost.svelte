<script lang="ts">
	import type { PostShape } from '@business/schema/PostSchema';
	import GUICardQuoteOf from '@gui/component/GUICardQuoteOf.svelte';
	import GUIDateTime from '@gui/component/GUIDateTime.svelte';
	import GUIUserHeader from '@gui/component/GUIUserHeader.svelte';
	import { BookmarkSimple, Heart, Quotes, Recycle } from 'phosphor-svelte';
	import { enhance } from '$app/forms';

	export let post: PostShape;
</script>

{#if post.repostOf}
	<svelte:self post={post.repostOf}>
		<span class="flex items-center gap-2 text-xs">
			<Recycle class="text-current" size={16} weight="fill" />
			<p>
				<a class="text-white font-bold" href="/{post.user.displayName}">
					{post.user.name}
					<span class="text-side">(@{post.user.displayName})</span>
				</a>
				reposted.
			</p>
		</span>
	</svelte:self>
{:else}
	<div class="grid gap-4 py-4 px-8 border-b-2 border-neutral-900">
		<slot />
		<GUIUserHeader user={post.user} />
		<GUICardQuoteOf quoteOf={post.quoteOf} />
		{#if post.content}
			<p class="leading-normal whitespace-pre-line">{post.content}</p>
		{/if}
		<GUIDateTime createdAt={post.createdAt} />
		<div class="flex items-center justify-between">
			<form action="/post/{post.id}?/handle-bookmark" method="post" use:enhance>
				<button
					type="submit"
					class="flex items-center gap-2 text-xs hover:cursor-pointer"
					aria-label="Bookmark Post"
				>
					<BookmarkSimple
						class={post.isBookmarked ? 'text-blue-500' : 'text-current'}
						size={16}
						weight={post.isBookmarked ? 'fill' : 'regular'}
					/>
					{#if post.bookmarkCount > 0}
						<p class="text-white font-black">
							{post.bookmarkCount}
						</p>
					{/if}
					<p class="hidden sm:block text-common">Bookmark Post</p>
				</button>
			</form>
			<form action="/post/{post.id}?/handle-favourite" method="post" use:enhance>
				<button
					type="submit"
					class="flex items-center gap-2 text-xs hover:cursor-pointer"
					aria-label="Like Post"
				>
					<Heart
						class={post.isFavourite ? 'text-danger' : 'text-current'}
						size={16}
						weight={post.isFavourite ? 'fill' : 'regular'}
					/>
					{#if post.favouriteCount > 0}
						<p class="text-white font-black">
							{post.favouriteCount}
						</p>
					{/if}
					<p class="hidden sm:block text-common">Like Post</p>
				</button>
			</form>
			<form action="/post/{post.id}?/create-repost" method="post" use:enhance>
				<button
					type="submit"
					class="flex items-center gap-2 text-xs hover:cursor-pointer"
					aria-label="Repost"
				>
					<Recycle
						class={post.isReposted ? 'text-main' : 'text-current'}
						size={16}
						weight={post.isReposted ? 'fill' : 'regular'}
					/>
					{#if post.repostCount > 0}
						<p class="text-white font-black">
							{post.repostCount}
						</p>
					{/if}
					<p class="text-common">Repost</p>
				</button>
			</form>
			<a
				class="flex items-center gap-2 text-xs hover:cursor-pointer"
				href="/post/{post.id}/compose"
				aria-label="Quote"
			>
				<Quotes
					class={post.isQuoted ? 'text-teal-500' : 'text-current'}
					size={16}
					weight={post.isQuoted ? 'fill' : 'regular'}
				/>
				{#if post.quoteCount > 0}
					<p class="text-white font-black">
						{post.quoteCount}
					</p>
				{/if}
				<p class="text-common">Quote</p>
			</a>
		</div>
	</div>
{/if}

<script lang="ts">
	import type { PostShape } from '@business/schema/PostSchema';
	import GUICardQuoteOf from '@gui/component/GUICardQuoteOf.svelte';
	import GUIDialogManagePost from "@gui/component/GUIDialogManagePost.svelte"
	import GUIDateTime from '@gui/component/GUIDateTime.svelte';
	import GUIUserHeader from '@gui/component/GUIUserHeader.svelte';
	import GUICardPostButtonList from '@gui/component/GUICardPostButtonList.svelte';
	import { Recycle } from 'phosphor-svelte';

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
	<div class="grid gap-4 p-8 border-b border-inactive">
		<slot />
		<div class="flex items-center justify-between">
			<GUIUserHeader user={post.user} />
			<GUIDialogManagePost {post} />
		</div>
		<GUICardQuoteOf quoteOf={post.quoteOf} />
		{#if post.content}
			<p class="leading-normal whitespace-pre-line">{post.content}</p>
		{/if}
		<div class="flex items-center gap-x-4 gap-y-2 flex-wrap">
			<GUIDateTime createdAt={post.createdAt} />
			<GUIDateTime createdAt={post.updatedAt} label="Updated" />
		</div>
		<GUICardPostButtonList {post} />
	</div>
{/if}

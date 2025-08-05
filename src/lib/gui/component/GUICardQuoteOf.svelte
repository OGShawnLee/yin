<script lang="ts">
	import type { PostShape } from '@business/schema/PostSchema';
	import GUIDateTime from '@gui/component/GUIDateTime.svelte';
	import GUIUserHeader from '@gui/component/GUIUserHeader.svelte';
	import { Quotes } from 'phosphor-svelte';

	export let quoteOf: PostShape | null;
	export let link = true;
</script>

{#if quoteOf}
	<div>
		<span class="flex items-center gap-2 text-xs">
			<Quotes class="text-current" size={16} weight="fill" />
			<p>
				Quoting
				{#if link}
					<a class="text-white font-bold" href="/{quoteOf.user.displayName}">
						{quoteOf.user.name}
						<span class="text-side">(@{quoteOf.user.displayName})</span>
					</a>.
				{:else}
					<span class="text-white font-bold">
						{quoteOf.user.name}
						<span class="text-side">(@{quoteOf.user.displayName})</span>.
					</span>
				{/if}
			</p>
		</span>
	</div>
	{#if link}
		<a href="/post/{quoteOf.id}">
			<div class="grid gap-4 py-4 px-8 bg-input border border-inactive rounded-md">
				<GUIUserHeader
					name={quoteOf.user.name}
					displayName={quoteOf.user.displayName}
					link={false}
				/>
				{#if quoteOf.content}
					<p class="leading-normal whitespace-pre-line">{quoteOf.content}</p>
				{/if}
				<GUIDateTime createdAt={quoteOf.createdAt} />
			</div>
		</a>
	{:else}
		<div class="grid gap-4 py-4 px-8 bg-input border border-inactive rounded-md">
			<GUIUserHeader name={quoteOf.user.name} displayName={quoteOf.user.displayName} link={false} />
			{#if quoteOf.content}
				<p class="leading-normal whitespace-pre-line">{quoteOf.content}</p>
			{/if}
			<GUIDateTime createdAt={quoteOf.createdAt} />
		</div>
	{/if}
{/if}

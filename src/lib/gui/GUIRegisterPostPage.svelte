<script lang="ts">
	import PostSchema, {
		type InsertPostShape,
		type ShallowPostShape
	} from '@business/schema/PostSchema';
	import type { CurrentUserShape } from '@business/schema/AuthSchema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import GUICardQuoteOf from '@gui/component/GUICardQuoteOf.svelte';
	import GUIInput from '@gui/component/GUIInput.svelte';
	import GUITopHeader from '@gui/component/GUITopHeader.svelte';
	import GUIUserHeader from '@gui/component/GUIUserHeader.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { Image, Notepad, PaperPlaneRight, Trash } from 'phosphor-svelte';
	import { ComposeState } from '@business/schema/ComposeSchema';

	export let data: {
		form: SuperValidated<InsertPostShape>,
		currentUser: CurrentUserShape,
		quoteOf: ShallowPostShape | null,
		state: ComposeState
	}

	const form = superForm(data.form, {
		validators: valibotClient(
			data.currentUser.isPro ? PostSchema.PRO_INSERT_POST_SCHEMA : PostSchema.INSERT_POST_SCHEMA
		)
	});
	const { form: input, enhance } = form;
</script>

<svelte:head>
	<title>Create Post - Yin</title>
</svelte:head>

<main class="my-20">
	<form method="post" action="?/create-post&state={data.state}" use:enhance>
		<GUITopHeader
			title="Compose"
			href="/post/compose"
			subtitle="Drafts"
			subhref="/post/compose/drafts"
		>
			<button
				class="size-12 min-w-12 flex items-center justify-center bg-main rounded-full text-white"
				aria-label="Publish Post"
				type="submit"
				slot="button"
			>
				<PaperPlaneRight size={24} />
				<p class="sr-only">Publish Post</p>
			</button>
		</GUITopHeader>
		<section class="py-4 px-8 grid gap-4 border-b-2 border-inactive">
			<GUIUserHeader user={data.currentUser} link={false} />
			<GUICardQuoteOf quoteOf={data.quoteOf} link={false} />
			<GUIInput
				{form}
				name="content"
				label="Content"
				hidden-label
				placeholder="What is on your mind?"
			>
				{#snippet field(props)}
					<textarea
						class="leading-normal whitespace-pre-line placeholder-side outline-none resize-none"
						{...props}
						required
						bind:value={$input.content}
					></textarea>
				{/snippet}
			</GUIInput>
			<div class="flex items-center gap-4">
				<button
					type="button"
					class="flex items-center gap-1 text-xs text-side hover:cursor-pointer"
					aria-label="Add Image"
				>
					<Image size={18} />
					<p class="text-side">Add Image</p>
				</button>
				<button
					class="flex items-center gap-1 text-xs text-side hover:not-disabled:cursor-pointer"
					aria-label="Save Draft"
					type="submit"
					formaction="?/create-draft&state={data.state}"
					disabled={data.state === ComposeState.EDIT_POST}
				>
					<Notepad size={18} />
					<p class="text-side">Save Draft</p>
				</button>
				<a
					class="flex items-center gap-1 text-xs text-side hover:cursor-pointer"
					aria-label="Discard Post"
					href="/"
				>
					<Trash size={18} />
					<p class="text-side">Discard Post</p>
				</a>
			</div>
		</section>
	</form>
</main>

<style>
	textarea {
		field-sizing: content;
	}
</style>

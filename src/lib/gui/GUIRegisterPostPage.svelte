<script lang="ts">
	import PostSchema, { type InsertPostShape } from '@business/schema/PostSchema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import GUIInput from './GUIInput.svelte';
	import GUIFormModal from './GUIFormModal.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<InsertPostShape>;

	const form = superForm(data, {
		validators: valibotClient(PostSchema.INSERT_POST_SCHEMA)
	});
	const { form: input, enhance } = form;
</script>

<svelte:head>
	<title>Create Post - Yin</title>
</svelte:head>

<GUIFormModal {enhance} title="Create Post">
	{#snippet fields()}
		<GUIInput {form} name="content" label="Content" placeholder="What is on your mind?">
			{#snippet field(props)}
				<textarea class="text-area" {...props} required bind:value={$input.content} ></textarea>
			{/snippet}
		</GUIInput>
	{/snippet}
	{#snippet button()}
		<div class="grid sm:grid-cols-2 gap-4">
			<button class="button button--main" type="submit"> Publish </button>
			<a class="button" href="/"> Cancel </a>
		</div>
	{/snippet}
</GUIFormModal>

<style>
  textarea {
    field-sizing: content;
  }
</style>
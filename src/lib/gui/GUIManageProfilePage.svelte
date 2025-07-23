<script lang="ts">
	import UserSchema, { type UpdateUserShape, type UserShape } from '@business/schema/UserSchema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import GUIInput from './GUIInput.svelte';
	import GUIFormModal from './GUIFormModal.svelte';
	// import { CurrentUserState } from './State.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<UpdateUserShape>;
	export let profile: UserShape;

	const form = superForm(data, {
		validators: valibotClient(UserSchema.UPDATE_USER_SCHEMA)
	});
	const { form: input, enhance } = form;
</script>

<svelte:head>
	<title>Update Profile - Yin</title>
</svelte:head>

<GUIFormModal {enhance} title="Update Profile">
	{#snippet fields()}
		<GUIInput {form} name="name" label="Name" placeholder="Introduce your Name">
			{#snippet field(props)}
				<input
					class="input"
					type="text"
					required
					{...props}
					placeholder={profile.name}
					bind:value={$input.name}
				/>
			{/snippet}
		</GUIInput>
		<GUIInput
			{form}
			name="description"
			label="Description"
			placeholder="Introduce your Description"
		>
			{#snippet field(props)}
				<textarea
					class="text-area"
					{...props}
					placeholder={profile.description ?? props.placeholder}
					bind:value={$input.description}
				></textarea>
			{/snippet}
		</GUIInput>
		<GUIInput {form} name="location" label="Location" placeholder="Introduce your Location">
			{#snippet field(props)}
				<input
					class="input"
					type="text"
					{...props}
					placeholder={profile.location ?? props.placeholder}
					bind:value={$input.location}
				/>
			{/snippet}
		</GUIInput>
	{/snippet}
	{#snippet button()}
		<div class="grid sm:grid-cols-2 gap-4">
			<button class="button button--main" type="submit"> Update Profile </button>
			<a class="button" href="/"> Cancel </a>
		</div>
	{/snippet}
</GUIFormModal>

<style>
	textarea {
		field-sizing: content;
	}
</style>

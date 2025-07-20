<script lang="ts">
	import Schema, { type SignInShape } from '@business/schema/AuthSchema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import GUIInput from './GUIInput.svelte';
	import GUIFormModal from './GUIFormModal.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<SignInShape>;

	const form = superForm(data, {
		validators: valibotClient(Schema.SIGN_IN_SCHEMA)
	});
	const { form: input, enhance } = form;
</script>

<svelte:head>
	<title>Sign In - Yin</title>
</svelte:head>

<GUIFormModal {enhance} title="Sign In">
	{#snippet fields()}
		<GUIInput {form} name="displayName" label="Username" placeholder="What is your Username?">
			{#snippet field(props)}
				<input class="input" type="text" {...props} required bind:value={$input.displayName} />
			{/snippet}
		</GUIInput>
		<GUIInput {form} name="password" label="Contraseña" placeholder="What is your Password?">
			{#snippet field(props)}
				<input class="input" type="password" {...props} required bind:value={$input.password} />
			{/snippet}
		</GUIInput>
	{/snippet}
	{#snippet button()}
    <div class="grid sm:grid-cols-2 gap-4">
      <button class="button button--main" type="submit"> Sign In </button>
      <a class="button" href="/"> Cancel </a>
    </div>
    <a class="button text-sm" href="/auth/sign-up">Don't have an Account?</a>
	{/snippet}
</GUIFormModal>

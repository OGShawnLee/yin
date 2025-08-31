<script lang="ts">
	import Schema, { type SignInShape } from '@business/schema/AuthSchema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import AUTH_IMAGE from '@gui/images/AUTH-IMAGE.jpg';
	import GUIInput from '@gui/component/GUIInput.svelte';
	import GUIFormModal from '@gui/GUIFormModal.svelte';
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

<img class="absolute top-0 sm:hidden" src={AUTH_IMAGE} alt="" />

<GUIFormModal {enhance} title="Sign In" logo>
	{#snippet fields()}
		<GUIInput {form} name="displayName" label="Username" placeholder="What is your Username?">
			{#snippet field(props)}
				<input class="input" type="text" {...props} required bind:value={$input.displayName} />
			{/snippet}
		</GUIInput>
		<GUIInput {form} name="password" label="Password" placeholder="What is your Password?">
			{#snippet field(props)}
				<input class="input" type="password" {...props} required bind:value={$input.password} />
			{/snippet}
		</GUIInput>
	{/snippet}
	{#snippet button()}
		<button class="button--main" type="submit"> Sign In </button>
    <a class="button text-sm" href="/auth/sign-up">Don't have an Account?</a>
	{/snippet}
</GUIFormModal>

<script lang="ts">
	import AuthSchema, { type SignUpShape } from '@business/schema/AuthSchema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import GUIInput from './GUIInput.svelte';
	import GUIFormModal from './GUIFormModal.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<SignUpShape>;

	const form = superForm(data, {
		validators: valibotClient(AuthSchema.SIGN_UP_SCHEMA)
	});
	const { form: input, enhance } = form;
</script>

<svelte:head>
	<title>Sign Up - Yin</title>
</svelte:head>

<GUIFormModal
	{enhance}
	title="Create Account"
	subtitle="Welcome to Yin. Please fill in the details to create your Yin Account."
>
	{#snippet fields()}
		<GUIInput {form} name="email" label="Email" placeholder="What is your Email?">
			{#snippet field(props)}
				<input class="input" type="email" {...props} required bind:value={$input.email} />
			{/snippet}
		</GUIInput>
		<GUIInput {form} name="name" label="Name" placeholder="What is your Name?">
			{#snippet field(props)}
				<input class="input" type="text" {...props} required bind:value={$input.name} />
			{/snippet}
		</GUIInput>
		<GUIInput {form} name="displayName" label="Username" placeholder="What will be your Username?">
			{#snippet field(props)}
				<input class="input" type="text" {...props} required bind:value={$input.displayName} />
			{/snippet}
		</GUIInput>
		<GUIInput {form} name="password" label="Password" placeholder="What will be your Password?">
			{#snippet field(props)}
				<input class="input" type="password" {...props} required bind:value={$input.password} />
			{/snippet}
		</GUIInput>
		<GUIInput
			{form}
			name="confirmPassword"
			label="Confirm Password"
			placeholder="Can you introduce your Password again?"
		>
			{#snippet field(props)}
				<input
					class="input"
					type="password"
					{...props}
					required
					bind:value={$input.confirmPassword}
				/>
			{/snippet}
		</GUIInput>
	{/snippet}
	{#snippet button()}
    <div class="grid sm:grid-cols-2 gap-4">
      <button class="button button--main" type="submit"> Continue </button>
      <a class="button" href="/"> Cancel </a>
    </div>
    <a class="button text-sm" href="/auth/sign-in">Already have an Account?</a>
	{/snippet}
</GUIFormModal>

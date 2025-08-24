<script lang="ts" generics="Form extends Record<string, unknown>, Path extends FormPath<Form>">
	import type { FormPath, SuperForm } from 'sveltekit-superforms';
	import type { Snippet } from 'svelte';
	import type { ControlAttrs } from 'formsnap';
	import { Control, Field, FieldErrors, Label } from 'formsnap';

	interface Properties {
		form: SuperForm<Form>;
		name: Path;
		label: string;
		'hidden-label'?: boolean;
		field: Snippet<[ControlAttrs & { placeholder: string }]>;
		'error-field'?: boolean;
		placeholder: string;
	}

	const {
		form,
		name,
		field,
		placeholder,
		label,
		'hidden-label': hiddenLabel,
		'error-field': hasErrorField = true
	}: Properties = $props();
</script>

<div class="grid gap-2">
	<Field {form} {name}>
		<Control>
			{#snippet children({ props })}
				<Label class="text-white font-medium {hiddenLabel ? 'sr-only' : 'inline'}">{label}</Label>
				{@render field({ ...props, placeholder })}
			{/snippet}
		</Control>
		{#if hasErrorField}
			<FieldErrors class="text-xs text-rose-400" />
		{/if}
	</Field>
</div>

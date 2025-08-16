<script lang="ts">
	import type { ShallowPostShape } from '@business/schema/PostSchema';
	import type { CurrentUserShape } from '@business/schema/AuthSchema';
	import GUICardQuoteOf from '@gui/component/GUICardQuoteOf.svelte';
	import GUIDateTime from '@gui/component/GUIDateTime.svelte';
	import GUIUserHeader from '@gui/component/GUIUserHeader.svelte';
	import { Eraser, PencilLine } from 'phosphor-svelte';
	import { enhance } from '$app/forms';

	export let draft: {
		id: string;
		content: string;
		user: CurrentUserShape;
		quoteOf: ShallowPostShape | null;
		createdAt: Date;
		updatedAt: Date | null;
	};
</script>

<div class="grid gap-4 py-4 px-8 border-b border-inactive">
	<GUIUserHeader user={draft.user} />
	<p class="leading-normal whitespace-pre-line">{draft.content}</p>
	<GUICardQuoteOf quoteOf={draft.quoteOf} />
	<div class="flex items-center gap-x-4 gap-y-2 flex-wrap">
		<GUIDateTime createdAt={draft.createdAt} />
		<GUIDateTime createdAt={draft.updatedAt} label="Updated" />
	</div>
	<div class="flex items-center gap-4">
		<a
			class="flex items-center gap-2 text-xs text-side hover:cursor-pointer"
			href="/post/{draft.id}/compose?state=EDIT_DRAFT"
			aria-label="Edit Draft"
		>
			<PencilLine class="text-current" size={16} />
			<p>Edit Draft</p>
		</a>
		<form action="?/delete-draft" method="post" use:enhance>
			<input type="hidden" name="id" value={draft.id} />
			<button
				type="submit"
				class="flex items-center gap-2 text-xs text-side hover:cursor-pointer"
				aria-label="Delete Draft"
			>
				<Eraser class="text-current" size={16} />
				<p>Delete Draft</p>
			</button>
		</form>
	</div>
</div>

<script lang="ts">
	import type { CurrentUserShape } from '@business/schema/AuthSchema';
	import type { ShallowPostShape } from '@business/schema/PostSchema';
	import GUIBottomMobileNavBar from '@gui/component/GUIBottomMobileNavBar.svelte';
	import GUICardDraft from '@gui/component/GUICardDraft.svelte';
	import GUITopHeader from '@gui/component/GUITopHeader.svelte';

  interface DraftShape {
		id: string;
		content: string;
		user: CurrentUserShape;
		quoteOf: ShallowPostShape | null;
		createdAt: Date;
		updatedAt: Date | null;
  }

	export let data: { draftList: DraftShape[] };
</script>

<svelte:head>
	<title>Drafts - Yin</title>
</svelte:head>

<main class="py-20">
		<GUITopHeader title="Drafts" href="/compose/drafts" subtitle="Compose" subhref="/post/compose?state=CREATE" />
	<section>
		<h2 class="sr-only">Recent Drafts</h2>
		<ul>
			{#each data.draftList as draft (draft.id)}
				<GUICardDraft {draft} />
			{/each}
		</ul>
	</section>
</main>

<GUIBottomMobileNavBar route="None" />

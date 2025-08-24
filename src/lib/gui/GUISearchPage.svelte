<script lang="ts">
	import type { SearchPostReturns, SearchUserReturns } from '@db/queries/queries';
	import SearchSchema, { type SearchSchemaShape } from '@business/schema/SearchSchema';
	import GUIBottomMobileNavBar from '@gui/component/GUIBottomMobileNavBar.svelte';
	import GUICardPost from '@gui/component/GUICardPost.svelte';
	import GUIInput from '@gui/component/GUIInput.svelte';
	import GUIProfileCard from '@gui/component/GUIProfileCard.svelte';
	import GUITopHeader from '@gui/component/GUITopHeader.svelte';
	import GUIMobileMenu from '@gui/layout/GUIMobileMenu.svelte';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';

	export let form: SuperValidated<SearchSchemaShape>;
	export let postList: SearchPostReturns;
	export let userList: SearchUserReturns;
	export let query: string | null;

	const input = superForm(form, {
		validators: valibotClient(SearchSchema.SEARCH_SCHEMA)
	});
</script>

<svelte:head>
	<title>{query ? query : 'Search'} - Yin</title>
</svelte:head>

<main class="py-20">
	<GUITopHeader title="Search">
		<form class="w-full">
			<GUIInput
				form={input}
				name="query"
				label="Search Query"
				placeholder="What are you looking for?"
				hidden-label
				error-field={false}
			>
				{#snippet field(props)}
					<input type="text" class="input w-full" {...props} required />
				{/snippet}
			</GUIInput>
		</form>
		<GUIMobileMenu slot="button" />
	</GUITopHeader>
	{#if userList.length > 0}
		<section>
			<header class="h-16 px-8 flex items-center border-b border-inactive">
				<h2 class="font-bold text-white tracking-wide">People</h2>
			</header>
			{#each userList as user (user.id)}
				<GUIProfileCard
					id={user.id}
					name={user.name}
					displayName={user.displayName}
					description={user.description}
					isFounder={user.isFounder}
					isPro={user.isPro}
					isStaff={user.isStaff}
				/>
			{/each}
		</section>
	{/if}
	{#if postList.length > 0}
		<section>
			<header class="h-16 px-8 flex items-center border-b border-inactive">
				<h2 class="font-bold text-white tracking-wide">Posts</h2>
			</header>
			<ul>
				{#each postList as post (post.id)}
					<GUICardPost {post} />
				{/each}
			</ul>
		</section>
	{/if}
</main>

<GUIBottomMobileNavBar route="Search" />

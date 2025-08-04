<script>
	import GUIPostCard from '@gui/component/GUICardPost.svelte';
	import GUINavigationTab from '@gui/component/GUINavigationTab.svelte';
	import { format } from '$lib';

	export let data;
</script>

<svelte:head>
  <title>{data.profile.name} (@{data.profile.displayName}) - Yin</title>
</svelte:head>

<div class="md:(grid gap-4)">
	<GUINavigationTab
		route="Favourites"
		routes={[
			{ label: 'Posts', href: format('/{0}', data.profile.displayName) },
			{ label: 'Favourites', href: format('/{0}/favourites', data.profile.displayName) }
		]}
	/>
	<div>
		<h2 class="sr-only">Recent Favourite Posts</h2>
		<ul>
			{#each data.favouriteList as favourite (favourite.id)}
				<GUIPostCard post={favourite.post} />
			{/each}
		</ul>
	</div>
</div>

<script lang="ts">
	import type { CurrentUserShape } from '@business/schema/AuthSchema';
	import GUIBottomMobileNavBar from '@gui/component/GUIBottomMobileNavBar.svelte';
	import GUINavigationTab from '@gui/component/GUINavigationTab.svelte';
	import GUITopHeader from '@gui/component/GUITopHeader.svelte';
	import { format } from '$lib';

	export let profile: CurrentUserShape;
	export let route: 'Followers' | 'Following';
</script>

<svelte:head>
	{#if route === 'Followers'}
		<title>People Following {profile.name} (@{profile.displayName}) - Yin</title>
	{:else}
		<title>People Followed By {profile.name} (@{profile.displayName}) - Yin</title>
	{/if}
</svelte:head>

<main class="py-20">
	<GUITopHeader title={profile.name} href="/{profile.displayName}" />
	<div class="md:(grid gap-4)">
		<GUINavigationTab
			{route}
			routes={[
				{ label: 'Followers', href: format('/{0}/followers', profile.displayName) },
				{ label: 'Following', href: format('/{0}/following', profile.displayName) }
			]}
		/>
		<section>
			<h2 class="sr-only">
				{route === 'Followers' ? 'Recent Followers' : 'Recent Users Followed'}
			</h2>
			<ul>
				<slot />
			</ul>
		</section>
	</div>
</main>

<GUIBottomMobileNavBar route="None" />

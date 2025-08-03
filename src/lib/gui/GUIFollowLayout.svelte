<script lang="ts">
	import type { CurrentUserShape } from '@business/schema/AuthSchema';
	import GUITopHeader from '@gui/component/GUITopHeader.svelte';
	import GUIBottomMobileNavBar from './component/GUIBottomMobileNavBar.svelte';

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
		<nav class="h-16 px-8 flex items-center justify-around border-b-2 border-inactive">
			<a
				href="/{profile.displayName}/followers"
				class="text-xs font-bold {route === 'Followers' ? 'text-white' : 'text-inactive'}"
			>
				Followers
			</a>
			<a
				href="/{profile.displayName}/following"
				class="text-xs font-bold {route === 'Following' ? 'text-white' : 'text-inactive'}"
			>
				Following
			</a>
		</nav>
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

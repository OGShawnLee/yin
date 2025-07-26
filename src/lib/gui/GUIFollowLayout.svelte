<script lang="ts">
	import type { CurrentUserShape } from '@business/schema/AuthSchema';

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

<main class="p-20">
	<header class="h-20 p-4 border-b border-neutral-900">
		<h1 class="heading-1">
			{profile.name}
		</h1>
		<p class="text-sm text-neutral-400">@{profile.displayName}</p>
	</header>
	<div class="grid gap-4">
		<nav class="h-16 px-4 flex items-center justify-around border-b border-neutral-900">
			<a
				href="/{profile.displayName}/followers"
				class="font-medium {route === 'Followers' ? 'text-white' : 'text-neutral-400'}"
			>
				Followers
			</a>
			<a
				href="/{profile.displayName}/following"
				class="font-medium {route === 'Following' ? 'text-white' : 'text-neutral-400'}"
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

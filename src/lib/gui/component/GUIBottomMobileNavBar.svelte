<script lang="ts">
	import { CurrentUserState } from '@gui/State';
	import { Bell, House, MagnifyingGlass, Pen, SignIn, UserCircle } from 'phosphor-svelte';

	export let route: 'Home' | 'Profile' | 'Notifications' | 'Search' | 'Bookmarks' | 'None';

	const currentUser = CurrentUserState.getContext();
</script>

<nav
	class="fixed bottom-0 inset-x-0 h-20 px-8 flex md:hidden items-center justify-between bg-black/70 backdrop-filter backdrop-blur-sm border-t border-inactive text-side"
>
	<a
		class="mobile-link-button"
		class:text-white={route === 'Search'}
		href="/search"
		aria-label="Search"
	>
		<MagnifyingGlass size={28} weight={route === 'Search' ? 'fill' : 'regular'} />
		Search
	</a>
	{#if $currentUser}
		<a
			class="mobile-link-button"
			class:text-white={route === 'Profile'}
			href="/{$currentUser.displayName}"
			aria-label="Profile"
		>
			<UserCircle size={28} weight={route === 'Profile' ? 'fill' : 'regular'} />
			Profile
		</a>
		<a
			class="size-12 min-w-12 flex items-center justify-center bg-main rounded-full text-white"
			href="/post/compose?state=CREATE"
			aria-label="Create Post"
		>
			<Pen size={32} />
			<p class="sr-only">Create Post</p>
		</a>
		<a
			class="mobile-link-button"
			class:text-white={route === 'Notifications'}
			href="/notifications"
			aria-label="Notifications"
		>
			<Bell size={28} weight={route === 'Notifications' ? 'fill' : 'regular'} />
			Notifications
		</a>
	{:else}
		<a class="mobile-link-button" href="/auth/sign-in" aria-label="Sign In">
			<SignIn size={28} />
			Sign In
		</a>
	{/if}
	<a class="mobile-link-button" class:text-white={route === 'Home'} href="/" aria-label="Home">
		<House size={28} weight={route === 'Home' ? 'fill' : 'regular'} />
		Home
	</a>
</nav>

<style>
	.mobile-link-button {
		--uno: 'min-w-12 h-12 flex flex-col items-center text-10px';
	}
</style>

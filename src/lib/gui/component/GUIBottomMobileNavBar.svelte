<script lang="ts">
	import { enhance } from '$app/forms';
	import { CurrentUserState } from '@gui/State';
	import {
		Bell,
		Bookmarks,
		House,
		MagnifyingGlass,
		Pen,
		SignIn,
		SignOut,
		User
	} from 'phosphor-svelte';

	export let route: 'Home' | 'Profile' | 'Search' | 'Bookmarks' | 'None';

	const currentUser = CurrentUserState.getContext();
</script>

<nav
	class="fixed bottom-0 inset-x-0 h-20 px-8 flex md:hidden items-center justify-between bg-black/70 backdrop-filter backdrop-blur-sm border-t-2 border-inactive"
>
	<!-- TODO: Add Search Feature -->
	<!-- <a
    class="size-12 min-w-12 flex items-center justify-center text-white"
    href="/search"
    aria-label="Search"
  >
    <MagnifyingGlass size={24} weight={route === 'Search' ? 'fill' : 'regular'} />
    <p class="sr-only">Search</p>
  </a> -->
	{#if $currentUser}
		<form action="/auth/sign-out" method="post" use:enhance>
			<button
				class="size-12 min-w-12 flex items-center justify-center text-white"
				aria-label="Sign Out"
			>
				<SignOut size={24} />
				<p class="sr-only">Sign Out</p>
			</button>
		</form>
		<a
			class="size-12 min-w-12 flex items-center justify-center text-white"
			href="/{$currentUser.displayName}"
			aria-label="Profile"
		>
			<User size={24} weight={route === 'Profile' ? 'fill' : 'regular'} />
			<p class="sr-only">Profile</p>
		</a>
		<a
			class="size-12 min-w-12 flex items-center justify-center bg-main rounded-full text-white"
			href="/post/compose"
			aria-label="Create Post"
		>
			<Pen size={24} />
			<p class="sr-only">Create Post</p>
		</a>
		<a
			class="size-12 min-w-12 flex items-center justify-center text-white"
			href="/bookmarks"
			aria-label="Bookmarks"
		>
			<Bookmarks size={24} weight={route === 'Bookmarks' ? 'fill' : 'regular'} />
			<p class="sr-only">Bookmarks</p>
		</a>
		<!-- TODO: Add Notification Feature -->
		<!-- <a
			class="size-12 min-w-12 flex items-center justify-center text-white"
			href="/notifications"
			aria-label="Notifications"
		>
			<Bell size={24} weight={route === 'Notifications' ? 'fill' : 'regular'} />
			<p class="sr-only">Notifications</p>
		</a> -->
	{:else}
		<a
			class="size-12 min-w-12 flex items-center justify-center text-white"
			href="/auth/sign-in"
			aria-label="Sign In"
		>
			<SignIn size={24} />
			<p class="sr-only">Sign In</p>
		</a>
	{/if}
	<a
		class="size-12 min-w-12 flex items-center justify-center text-white"
		href="/"
		aria-label="Home"
	>
		<House size={24} weight={route === 'Home' ? 'fill' : 'regular'} />
		<p class="sr-only">Home</p>
	</a>
</nav>

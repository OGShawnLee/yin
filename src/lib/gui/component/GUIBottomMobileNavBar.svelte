<script lang="ts">
	import { CurrentUserState } from '@gui/State';
	import { Bell, House, MagnifyingGlass, Pen, SignIn, User, UserCircle } from 'phosphor-svelte';

	export let route: 'Home' | 'Profile' | 'Notifications' | 'Search' | 'Bookmarks' | 'None';

	const currentUser = CurrentUserState.getContext();
</script>

<nav
	class="fixed bottom-0 inset-x-0 h-20 px-8 flex md:hidden items-center justify-between bg-black/70 backdrop-filter backdrop-blur-sm border-t-2 border-inactive"
>
	<a
		class="size-12 min-w-12 flex flex-col items-center"
		class:text-white={route === 'Search'}
		href="/search"
		aria-label="Search"
	>
		<MagnifyingGlass size={28} weight={route === 'Search' ? 'fill' : 'regular'} />
		<span class="text-xs"> Search </span>
	</a>
	{#if $currentUser}
		<!-- TODO: Add Mobile Sidebar -->
		<!-- <form action="/auth/sign-out" method="post" use:enhance>
			<button
				class="size-12 min-w-12 flex items-center justify-center text-white"
				aria-label="Sign Out"
			>
				<SignOut size={24} />
				<p class="sr-only">Sign Out</p>
			</button>
		</form> -->
		<a
			class="size-12 min-w-12 flex flex-col items-center"
			class:text-white={route === 'Profile'}
			href="/{$currentUser.displayName}"
			aria-label="Profile"
		>
			<UserCircle size={28} weight={route === 'Profile' ? 'fill' : 'regular'} />
			<span class="text-xs"> Profile </span>
		</a>
		<a
			class="size-14 min-w-14 flex items-center justify-center bg-main rounded-full text-white"
			href="/post/compose"
			aria-label="Create Post"
		>
			<Pen size={32} />
			<p class="sr-only">Create Post</p>
		</a>
		<!-- TODO: Add Mobile Sidebar -->
		<!-- <a
			class="size-12 min-w-12 flex items-center justify-center text-white"
			href="/bookmarks"
			aria-label="Bookmarks"
		>
			<Bookmarks size={24} weight={route === 'Bookmarks' ? 'fill' : 'regular'} />
			<p class="sr-only">Bookmarks</p>
		</a> -->
		<a
			class="size-12 min-w-12 flex flex-col items-center"
			class:text-white={route === 'Notifications'}
			href="/notifications"
			aria-label="Notifications"
		>
			<Bell size={28} weight={route === 'Notifications' ? 'fill' : 'regular'} />
			<span class="text-xs"> Activity </span>
		</a>
	{:else}
		<a
			class="size-12 min-w-12 flex flex-col items-center"
			href="/auth/sign-in"
			aria-label="Sign In"
		>
			<SignIn size={28} />
			<span class="text-xs"> Sign In </span>
		</a>
	{/if}
	<a
		class="size-12 min-w-12 flex flex-col items-center"
		class:text-white={route === 'Home'}
		href="/"
		aria-label="Home"
	>
		<House size={28} weight={route === 'Home' ? 'fill' : 'regular'} />
		<span class="text-xs"> Home </span>
	</a>
</nav>

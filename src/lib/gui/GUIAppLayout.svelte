<script lang="ts">
	import { Bookmarks, House, Pen, User } from 'phosphor-svelte';
	import { CurrentUserState } from '@gui/State';
	import { SignOut } from 'phosphor-svelte';
	import { enhance } from '$app/forms';
	import { fade, fly } from 'svelte/transition';
	import { circIn } from 'svelte/easing';

	export let path: string;

	const currentUser = CurrentUserState.getContext();

	function getNameInitials(name: string): string {
		return name
			.split(' ')
			.map((part) => part.charAt(0).toUpperCase())
			.join('');
	}
</script>

<div class="relative min-h-screen max-w-6xl w-full mx-auto | flex gap-8">
	<nav class="hidden sticky h-full top-80px w-300px | xl:flex flex-col justify-between">
		<div class="flex flex-col items-start gap-8">
			<a class="font-medium hover:text-white flex items-center gap-2" href="/">
				<House size={24} />
				Home
			</a>
			{#if $currentUser}
				<a
					class="font-medium hover:text-white flex items-center gap-2"
					href="/{$currentUser.displayName}"
				>
					<User size={24} />
					Profile
				</a>
				<a class="font-medium hover:text-white flex items-center gap-2" href="/bookmarks">
					<Bookmarks size={24} />
					Bookmarks
				</a>
				<a class="font-medium hover:text-white flex items-center gap-2" href="/post/compose">
					<Pen size={24} />
					Create Post
				</a>
			{/if}
		</div>
		<section class="grid gap-4">
			{#if $currentUser}
				<h2 class="hidden">User Status</h2>
				<div class="flex gap-4 items-center">
					<div
						class="size-12 flex items-center justify-center bg-gradient-to-l from-teal-400 to-cyan-600 bg-main rounded-lg font-bold text-lg"
					>
						{getNameInitials($currentUser.name)}
					</div>
					<div>
						<p class="text-lg text-white font-medium">{$currentUser.name}</p>
						<p class="text-neutral-400">@{$currentUser.displayName}</p>
					</div>
				</div>
				<form action="/auth/sign-out" method="post" use:enhance>
					<button class="button flex gap-2" aria-label="Sign Out">
						Sign Out <SignOut size={24} />
					</button>
				</form>
			{:else}
				<a class="button button--main" href="/auth/sign-in"> Sign In </a>
			{/if}
		</section>
	</nav>
	{#key path}
		<main
			class="w-full flex flex-col xl:px-20 xl:flex-[600px]"
			in:fade={{ duration: 350, easing: circIn }}
		>
			<slot />
		</main>
	{/key}
</div>

<style>
	/* top-header-height -> 64px + container-gap -> 28px = 88px */
	nav {
		min-height: calc(100vh - 80px - 80px);
	}
</style>

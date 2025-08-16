<script lang="ts">
	import GUILogo from '@gui/component/GUILogo.svelte';
	import GUIUserHeader from '@gui/component/GUIUserHeader.svelte';
	import { CurrentUserState } from '@gui/State';
	import { Dialog } from 'bits-ui';
	import {
		Bookmark,
		DotsThreeCircleVertical,
		Bell,
		House,
		MagnifyingGlass,
		SignOut,
		UserCircle,
		X
	} from 'phosphor-svelte';
	import { fly } from 'svelte/transition';
	import { enhance } from '$app/forms';

	const currentUser = CurrentUserState.getContext();
</script>

{#if $currentUser}
	<Dialog.Root>
		<Dialog.Trigger
			class="size-10 min-w-10 flex items-center justify-center bg-input border border-inactive rounded-lg outline-none focus:(ring-2 ring-white) sm:hidden"
		>
			<DotsThreeCircleVertical class="text-white" size={24} />
			<span class="sr-only"> Open Menu </span>
		</Dialog.Trigger>
		<Dialog.Portal>
			<Dialog.Content
				class="fixed inset-0 z-90 bg-black/80 backdrop-filter backdrop-blur-sm"
				forceMount
			>
				{#snippet child(context)}
					{#if context.open}
						<div {...context.props} transition:fly={{ y: 120, duration: 300 }}>
							<header class="h-20 px-8 flex items-center justify-between border-b border-inactive">
								<Dialog.Title class="sr-only" level={3}>Navigation</Dialog.Title>
								<GUILogo />
								<Dialog.Close
									class="size-10 min-w-10 flex items-center justify-center bg-input border border-inactive rounded-lg outline-none focus:(ring-2 ring-white)"
								>
									<X class="text-white" size={24} />
								</Dialog.Close>
							</header>
							<div class="p-8 grid gap-8">
								<GUIUserHeader user={$currentUser} />
								<nav class="grid gap-4">
									<a class="h-12 flex items-center justify-between" href="/">
										<span> Home </span>
										<House size={24} />
									</a>
									<a class="h-12 flex items-center justify-between" href="/search">
										<span> Search </span>
										<MagnifyingGlass size={24} />
									</a>
									<a
										class="h-12 flex items-center justify-between"
										href="/{$currentUser.displayName}"
									>
										<span> Profile </span>
										<UserCircle size={24} />
									</a>
									<a class="h-12 flex items-center justify-between" href="/notifications">
										<span> Notifications </span>
										<Bell size={24} />
									</a>
									<a class="h-12 flex items-center justify-between" href="/bookmarks">
										<span> Bookmarks </span>
										<Bookmark size={24} />
									</a>
									<form action="/auth/sign-out" method="post" use:enhance>
										<button
											class="h-12 w-full flex items-center justify-between"
											aria-label="Sign Out"
										>
											Sign Out <SignOut size={24} />
										</button>
									</form>
								</nav>
							</div>
						</div>
					{/if}
				{/snippet}
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
{/if}

<script lang="ts">
	import DateFormatter from '@common/DateFormatter';
	import { MapPin } from 'phosphor-svelte';
	import { enhance } from '$app/forms';

	export let data;
</script>

<svelte:head>
	<title>{data.profile.name} (@{data.profile.displayName}) - Yin</title>
</svelte:head>

<main class="py-20 grid gap-4">
	<header class="h-20 p-4 border-b border-neutral-900 flex items-center justify-between">
		<h1 class="heading-1">{data.profile.name}</h1>
		{#if data.currentUser && data.currentUser.displayName === data.profile.displayName}
			<!-- Edit Profile Button -->
			<a
				class="h-10 px-8 flex items-center justify-center bg-white rounded-full text-black font-medium hover:cursor-pointer"
				href="/settings/profile">Edit Profile</a
			>
		{:else if data.currentUser}
			<!-- Follow Button -->
			<form action="/{data.profile.displayName}?/handle-follow" method="post" use:enhance>
				<button
					type="submit"
					class="h-10 px-8 flex items-center justify-center bg-white rounded-full text-black font-medium hover:cursor-pointer"
				>
					{data.profile.isFollowing ? 'Following' : 'Follow'}
				</button>
			</form>
		{/if}
	</header>
	<section class="p-4 grid gap-4 border-b border-neutral-900">
		<header>
			<h2 class="heading-2">{data.profile.name}</h2>
			<p class="text-neutral-400">@{data.profile.displayName}</p>
		</header>
		{#if data.profile.description}
			<p class="whitespace-pre-line">{data.profile.description}</p>
		{/if}
		{#if data.profile.followerCount || data.profile.followingCount}
			<div class="flex gap-4">
				{#if data.profile.followerCount}
					<a
						class="text-sm text-neutral-400 hover:(underline underline-offset-4)"
						href="/{data.profile.displayName}/followers"
					>
						<span class="text-white font-medium">
							{data.profile.followerCount}
						</span>
						{data.profile.followerCount === 1 ? 'Follower' : 'Followers'}
					</a>
				{/if}
				{#if data.profile.followingCount}
					<a
						class="text-sm text-neutral-400 hover:(underline underline-offset-4)"
						href="/{data.profile.displayName}/following"
					>
						<span class="text-white font-medium">
							{data.profile.followerCount}
						</span>
						Following
					</a>
				{/if}
			</div>
		{/if}
		{#if data.profile.location}
			<p class="flex items-center gap-2 text-neutral-400">
				<MapPin size={24} />
				{data.profile.location}
			</p>
		{/if}
		<time class="text-sm text-neutral-400" datetime={data.profile.createdAt.toISOString()}>
			Joined {DateFormatter.getFormattedDate(data.profile.createdAt)} - {DateFormatter.getRelativeDate(
				data.profile.createdAt
			)}
		</time>
	</section>
	<section>
		<slot />
	</section>
</main>

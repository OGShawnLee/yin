<script lang="ts">
	import GUITopHeader from '@gui/component/GUITopHeader.svelte';
	import GUIBadgeList from '@gui/component/GUIBadgeList.svelte';
	import GUIUserHeader from '@gui/component/GUIUserHeader.svelte';
	import GUIDateTime from '@gui/component/GUIDateTime.svelte';
	import GUIBottomMobileNavBar from '@gui/component/GUIBottomMobileNavBar.svelte';
	import { MapPin } from 'phosphor-svelte';
	import { enhance } from '$app/forms';

	export let data;
</script>

<svelte:head>
	<title>{data.profile.name} (@{data.profile.displayName}) - Yin</title>
</svelte:head>

<main class="py-20">
	<GUITopHeader href="/{data.profile.displayName}" title={data.profile.name}>
		<svelte:fragment slot="button">
			{#if data.currentUser && data.currentUser.displayName === data.profile.displayName}
				<a
					class="h-10 px-8 flex items-center justify-center bg-white rounded-full text-black font-bold hover:cursor-pointer"
					href="/settings/profile">Edit Profile</a
				>
			{:else if data.currentUser}
				<form action="/{data.profile.displayName}?/handle-follow" method="post" use:enhance>
					<button
						type="submit"
						class="h-10 px-8 flex items-center justify-center bg-white rounded-full text-black font-bold hover:cursor-pointer"
					>
						{data.profile.isFollowing ? 'Following' : 'Follow'}
					</button>
				</form>
			{/if}
		</svelte:fragment>
	</GUITopHeader>
	<div class="md:(grid gap-4)">
		<section class="py-4 px-8 grid gap-4 border-b-2 border-neutral-900">
			<GUIUserHeader name={data.profile.name} displayName={data.profile.displayName} />
			<GUIBadgeList
				isFounder={data.profile.isFounder}
				isPro={data.profile.isPro}
				isStaff={data.profile.isStaff}
			/>
			{#if data.profile.description}
				<p class="leading-relaxed whitespace-pre-line">{data.profile.description}</p>
			{/if}
			{#if data.profile.location}
				<p class="flex items-center gap-2 text-xs text-side">
					<MapPin size={24} />
					{data.profile.location}
				</p>
			{/if}
			{#if data.profile.followerCount || data.profile.followingCount}
				<div class="flex gap-4">
					{#if data.profile.followerCount}
						<a
							class="text-xs text-side underline underline-offset-4"
							href="/{data.profile.displayName}/followers"
						>
							<span class="text-white font-black">
								{data.profile.followerCount}
							</span>
							{data.profile.followerCount === 1 ? 'Follower' : 'Followers'}
						</a>
					{/if}
					{#if data.profile.followingCount}
						<a
							class="text-xs text-side underline underline-offset-4"
							href="/{data.profile.displayName}/following"
						>
							<span class="text-white font-black">
								{data.profile.followingCount}
							</span>
							Following
						</a>
					{/if}
				</div>
			{/if}
			<GUIDateTime createdAt={data.profile.createdAt} label="Joined" />
		</section>
		<section>
			<slot />
		</section>
	</div>
</main>

<GUIBottomMobileNavBar route="Profile" />

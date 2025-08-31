<script lang="ts">
	import GUIBadgeList from '@gui/component/GUIBadgeList.svelte';
	import GUIBottomMobileNavBar from '@gui/component/GUIBottomMobileNavBar.svelte';
	import GUIDateTime from '@gui/component/GUIDateTime.svelte';
	import GUIMobileMenu from '@gui/layout/GUIMobileMenu.svelte';
	import GUITopHeader from '@gui/component/GUITopHeader.svelte';
	import GUIUserHeader from '@gui/component/GUIUserHeader.svelte';
	import { MapPin } from 'phosphor-svelte';
	import { enhance } from '$app/forms';

	export let data;
</script>

<main class="py-20">
	<GUITopHeader href="/{data.profile.displayName}" title={data.profile.name}>
		<GUIMobileMenu slot="button" />
	</GUITopHeader>
	<section class="p-8 grid gap-4 bordered-b">
		<div class="flex items-center justify-between">
			<GUIUserHeader user={data.profile} badge={false} />
			{#if data.currentUser && data.currentUser.displayName === data.profile.displayName}
				<a class="button-black-white-rounded" href="/settings/profile">Edit Profile</a>
			{:else if data.currentUser}
				<form action="/{data.profile.displayName}?/handle-follow" method="post" use:enhance>
					<button type="submit" class="button-black-white-rounded">
						{data.profile.isFollowing ? 'Following' : 'Follow'}
					</button>
				</form>
			{/if}
		</div>
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
						<span class="#text-summit font-black">
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
						<span class="#text-summit font-black">
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
</main>

<GUIBottomMobileNavBar route="Profile" />

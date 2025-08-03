<script lang="ts">
	import GUIFollowLayout from '@gui/GUIFollowLayout.svelte';
	import GUIProfileCard from '@gui/GUIProfileCard.svelte';

	export let data;
</script>

<GUIFollowLayout profile={data.profile} route="Followers">
	{#each data.followerList as follow (follow.id)}
		<GUIProfileCard
			name={follow.follower.name}
			displayName={follow.follower.displayName}
			description={follow.follower.description}
			isFounder={follow.follower.isFounder}
			isPro={follow.follower.isPro}
			isStaff={follow.follower.isStaff}
		/>
	{/each}
</GUIFollowLayout>

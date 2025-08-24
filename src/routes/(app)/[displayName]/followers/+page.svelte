<script lang="ts">
	import GUIFollowLayout from '@gui/layout/GUIFollowLayout.svelte';
	import GUIProfileCard from '@gui/component/GUIProfileCard.svelte';

	export let data;
</script>

<GUIFollowLayout profile={data.profile} route="Followers">
	{#each data.followerList as follow (follow.id)}
		<GUIProfileCard
			id={follow.follower.id}
			name={follow.follower.name}
			displayName={follow.follower.displayName}
			description={follow.follower.description}
			isFounder={follow.follower.isFounder}
			isPro={follow.follower.isPro}
			isStaff={follow.follower.isStaff}
		/>
	{/each}
</GUIFollowLayout>

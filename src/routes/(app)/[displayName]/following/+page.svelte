<script lang="ts">
	import GUIFollowLayout from '@gui/GUIFollowLayout.svelte';
	import GUIProfileCard from '@gui/GUIProfileCard.svelte';
  
	export let data;
</script>

<GUIFollowLayout profile={data.profile} route="Following">
	{#each data.followingList as follow (follow.id)}
		<GUIProfileCard
			id={follow.followee.id}
			name={follow.followee.name}
			displayName={follow.followee.displayName}
			description={follow.followee.description}
			isFounder={follow.followee.isFounder}
			isPro={follow.followee.isPro}
			isStaff={follow.followee.isStaff}
		/>
	{/each}
</GUIFollowLayout>
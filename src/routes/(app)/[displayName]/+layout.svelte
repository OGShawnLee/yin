<script lang="ts">
	import DateFormatter from '@common/DateFormatter';

	export let data;
</script>

<svelte:head>
	<title>Home - Yin</title>
</svelte:head>

<main class="p-20 grid gap-4">
	<header class="h-20 p-4 border-b border-neutral-900 flex items-center justify-between">
		<h1 class="heading-1">{data.profile.name}</h1>
		{#if data.currentUser && data.currentUser.displayName === data.profile.displayName}
			<a
				class="h-10 px-8 flex items-center justify-center bg-white rounded-full text-black font-medium"
				href="/settings/profile">Edit Profile</a
			>
		{/if}
	</header>
	<section class="p-4 grid gap-4 border-b border-neutral-900">
		<header>
			<h2 class="heading-2">{data.profile.name}</h2>
			<p class="text-neutral-400">@{data.profile.displayName}</p>
		</header>
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

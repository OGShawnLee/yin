<script lang="ts">
	import GUIPostCard from '@gui/GUIPostCard.svelte';
  
	export let data;
</script>

<svelte:head>
	<title>{data.profile.name} (@{data.profile.displayName}) - Yin</title>
</svelte:head>

<main class="p-20 grid gap-4">
	<header class="h-20 p-4 border-b border-neutral-900">
		<h1 class="heading-1">
      {data.profile.name}
    </h1>
    <p class="text-sm">Followers</p>
	</header>
	<section>
		<h2 class="sr-only">Recent Followers</h2>
		<ul>
			{#each data.followerList as follow (follow.id)}
				<li>
          <article class="p-4 grid gap-2 border-b border-neutral-900">
            <header>
              <h2 class="text-lg text-white font-medium">{follow.follower.name}</h2>
              <a class="text-sm text-neutral-400" href="/{follow.follower.displayName}">
                @{follow.follower.displayName}
              </a>
            </header>
            {#if follow.follower.description}
              <p class="whitespace-pre-line">{follow.follower.description}</p>
            {/if}
          </article>
				</li>
			{/each}
		</ul>
	</section>
</main>

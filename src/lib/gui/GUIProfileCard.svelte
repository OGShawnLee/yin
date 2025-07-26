<script lang="ts">
  export let name: string;
  export let displayName: string;
  export let description: string | null;
</script>

<article class="p-4 grid gap-2 border-b border-neutral-900">
	<header>
		<h2 class="text-lg text-white font-medium">{name}</h2>
		<a class="text-sm text-neutral-400" href="/{displayName}">
			@{displayName}
		</a>
	</header>
	{#if description}
		<p class="whitespace-pre-line">{description}</p>
	{/if}
</article>

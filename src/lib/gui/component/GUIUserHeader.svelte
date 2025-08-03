<script lang="ts">
	export let name: string;
	export let displayName: string;
	export let link = true;
</script>

<div class="grid">
	<p class="text-lg text-white font-bold leading-tight">{name}</p>

	{#if link}
		<a class="text-xs text-side font-bold leading-tight" href="/{displayName}">
			@{displayName}
		</a>
	{:else}
		<p class="text-xs text-side font-bold leading-tight">
			@{displayName}
		</p>
	{/if}
</div>

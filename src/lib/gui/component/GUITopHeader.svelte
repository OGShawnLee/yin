<script lang="ts">
	export let title: string;
	export let href = '';
	export let subtitle = '';
	export let subhref = '';
</script>

<header
	class="fixed xl:sticky top-0 inset-x-0 h-20 px-8 flex items-center justify-between gap-8 bg-black/70 backdrop-filter backdrop-blur-sm border-b-2 border-inactive"
>
	<div class="flex items-center gap-8">
		{#if href}
			<a {href}>
				<h1 class="text-xl font-bold text-white">
					{title}
				</h1>
			</a>
		{:else}
			<h1 class="text-xl font-bold text-white">
				{title}
			</h1>
		{/if}
		{#if subtitle}
			<a class="text-xl font-bold text-inactive" href={subhref}>
				{subtitle}
			</a>
		{/if}
	</div>
	<slot name="button" />
</header>

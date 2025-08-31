<script lang="ts">
	export let title: string;
	export let href = '';
	export let subtitle = '';
	export let subhref = '';

	function handleLongTitle(title: string) {
		if (title.length > 12) {
			return title.slice(0, 12) + '...';
		}

		return title;
	}
</script>

<header
	class="fixed z-10 xl:sticky top-0 inset-x-0 h-20 px-8 flex items-center justify-between gap-8 bg-white/70 dark:bg-black/70 backdrop-filter backdrop-blur-sm bordered-b"
>
	<div class="flex items-center gap-8" class:sr-only={$$slots.default}>
		{#if href}
			<a {href}>
				<h1 class="text-xl #text-summit font-bold">
					{title}
				</h1>
			</a>
		{:else}
			<h1 class="text-xl #text-summit font-bold">
				{title}
			</h1>
		{/if}
		{#if subtitle}
			<a class="text-xl #text-inactive font-bold" href={subhref}>
				{subtitle}
			</a>
		{/if}
	</div>
	<slot />
	<slot name="button" />
</header>

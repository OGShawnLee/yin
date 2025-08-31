<script lang="ts">
	import type { Snippet } from 'svelte';
	import { X } from 'phosphor-svelte';
	import GUILogo from '@gui/component/GUILogo.svelte';

	interface Properties {
		enhance: (el: HTMLFormElement) => void;
		fields: Snippet<[]>;
		button: Snippet<[]>;
		title: string;
		logo?: boolean;
	}

	const { enhance, fields, button, title, logo = false }: Properties = $props();
</script>

<main
	class="min-h-screen py-8 px-8 flex flex-col items-center justify-center bg-white dark:bg-black/80 sm:backdrop-filter-none backdrop-filter backdrop-blur-sm"
>
	<div class="max-w-xl w-full mx-auto grid gap-4">
		{#if logo}
			<div class="px-8">
				<GUILogo />
			</div>
		{/if}
		<form
			class="max-w-xl w-full mx-auto mx-8 flex flex-col gap-8 border border-inactive-light dark:border-inactive rounded-xl"
			method="POST"
			use:enhance
		>
			<header class="h-20 px-8 flex items-center justify-between bordered-b">
				<h1 class="text-2xl #text-summit font-semibold tracking-tight">{title}</h1>
				<a class="button-square-input" href="/" aria-label="Return to Home">
					<X size={24} />
					<p class="sr-only">Return to Home</p>
				</a>
			</header>
			<div class="pb-8 px-8 grid gap-4">
				<div class="grid gap-4">
					{@render fields()}
				</div>
				<div class="mt-4 grid gap-4">
					{@render button()}
				</div>
			</div>
		</form>
	</div>
</main>

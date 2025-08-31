<script lang="ts">
	import { Moon, Sun } from 'phosphor-svelte';
	import { toggleMode, mode } from 'mode-watcher';

	export let variant: 'desktop/tablet' | 'mobile' | 'mobile-bottom';
</script>

{#if variant === 'desktop/tablet'}
	<button
		class="flex items-center gap-4 hover:#text-summit hover:cursor-pointer"
		on:click={toggleMode}
	>
		<svelte:component this={mode.current === 'dark' ? Sun : Moon} size={24} />
		<span> {mode.current === 'dark' ? 'Enable Light Mode' : 'Enable Dark Mode'} </span>
	</button>
{:else if variant === "mobile"}
	<button class="h-12 flex items-center justify-between" on:click={toggleMode}>
		<span>
			{mode.current === 'dark' ? 'Enable Light Mode' : 'Enable Dark Mode'}
		</span>
		<svelte:component this={mode.current === 'dark' ? Sun : Moon} size={24} />
	</button>
{:else}
	<button class="mobile-link-button" on:click={toggleMode}>
		<svelte:component this={mode.current === 'dark' ? Sun : Moon} size={28} />
		<span>
			{mode.current === 'dark' ? 'Light' : 'Dark'}
		</span>
	</button>
{/if}

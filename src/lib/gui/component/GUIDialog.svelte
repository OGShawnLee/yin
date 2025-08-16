<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { X } from 'phosphor-svelte';
	import { fade, fly, scale } from 'svelte/transition';

	export let title: string;
</script>

<Dialog.Portal>
	<Dialog.Overlay forceMount>
		{#snippet child(context)}
			{#if context.open}
				<div
					class="fixed inset-0 z-80 bg-black/80 backdrop-filter backdrop-blur-sm"
					{...context.props}
					transition:fade={{ duration: 300 }}
				></div>
			{/if}
		{/snippet}
	</Dialog.Overlay>
	<div
		class="fixed bottom-0 inset-x-0 z-90 flex items-center justify-center sm:(bottom-initial top-1/2 transform -translate-y-1/2 px-8)"
	>
		<!-- class="fixed top-1/2 inset-x-0 z-90 transform -translate-y-1/2 px-8 flex items-center justify-center" -->
		<Dialog.Content forceMount>
			{#snippet child(context)}
				{#if context.open}
					<div
						class="max-w-md w-full sm:border-2 border-inactive rounded-2xl bg-input sm:bg-black"
						{...context.props}
						transition:fly={{ y: 120, duration: 300 }}
					>
						<header class="h-20 px-8 flex items-center justify-between border-b-2 border-inactive">
							<Dialog.Title class="text-xl text-white font-bold" level={3}>
								{title}
							</Dialog.Title>
							<Dialog.Close
								class="size-10 min-w-10 flex items-center justify-center bg-input border border-inactive rounded-lg outline-none focus:(ring-2 ring-white)"
							>
								<X class="text-white" size={24} />
							</Dialog.Close>
						</header>
						<div class="p-8 grid gap-6">
							<slot />
						</div>
						<div class="px-8 pb-8 w-full flex items-center gap-4">
							<slot name="footer" />
						</div>
					</div>
				{/if}
			{/snippet}
		</Dialog.Content>
	</div>
</Dialog.Portal>

<script lang="ts">
  export let routes: { label: string, href: string }[];
	export let route: string;
</script>

<nav class="h-16 px-8 flex items-center justify-around border-b border-inactive">
	{#each routes as it}
		<a
			href={it.href}
			class="text-xs font-bold {it.label === route ? 'text-white' : 'text-inactive'}"
		>
			{it.label}
		</a>
	{/each}
</nav>

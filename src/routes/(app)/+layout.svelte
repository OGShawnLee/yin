<script lang="ts">
	import GUIAppLayout from '@gui/GUIAppLayout.svelte';

	export let data;
</script>

<GUIAppLayout currentUser={data.currentUser} path={data.path}>
	<slot />
</GUIAppLayout>
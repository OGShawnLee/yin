<script lang="ts">
	import GUIAppLayout from '@gui/layout/GUIAppLayout.svelte';
	import { CurrentUserState } from '@gui/State';

	export let data;

	const currentUser = CurrentUserState.mount(data.currentUser);

	$: currentUser.set(data.currentUser);
</script>

<GUIAppLayout path={data.path}>
	<slot />
</GUIAppLayout>

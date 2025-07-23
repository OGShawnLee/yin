<script lang="ts">
	import GUIAppLayout from '@gui/GUIAppLayout.svelte';
	import { CurrentUserState } from '@gui/State.js';

	export let data;

	const currentUser = CurrentUserState.mount(data.currentUser);

	$: currentUser.set(data.currentUser);
</script>

<GUIAppLayout path={data.path}>
	<slot />
</GUIAppLayout>

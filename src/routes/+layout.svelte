<script>
	import 'virtual:uno.css';
	import { ModeWatcher } from "mode-watcher";
</script>

<ModeWatcher defaultMode="dark" />
<slot />

<style>
	:global(body) {
		--uno: 'font-satoshi #bg-ground #text-common';
	}
</style>
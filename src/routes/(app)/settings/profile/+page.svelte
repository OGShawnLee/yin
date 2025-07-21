<script>
	import GUIManageProfilePage from '@gui/GUIManageProfilePage.svelte';

	export let data;
</script>

<GUIManageProfilePage data={data.form} profile={data.profile} />

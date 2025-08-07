<script>
  import GUIPostPage from '@gui/GUIPostPage.svelte';
  import GUIBottomMobileNavBar from '@gui/component/GUIBottomMobileNavBar.svelte';

  export let data;
</script>

<GUIPostPage post={data.post} />
<GUIBottomMobileNavBar route="None" />
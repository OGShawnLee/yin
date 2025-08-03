<script lang="ts">
	import DateFormatter from '@common/DateFormatter';

	export let createdAt: Date | null | undefined;
	export let label = '';
</script>

{#if createdAt}
	<time class="text-xs text-side" datetime={createdAt.toISOString()}>
		{label}
		{DateFormatter.getFormattedDate(createdAt)} - {DateFormatter.getRelativeDate(createdAt)}
	</time>
{/if}

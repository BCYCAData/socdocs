<script lang="ts">
	import type { DocStatus } from '$lib/types';

	let { status } = $props<{ status: DocStatus }>();
</script>

{#if status !== 'complete'}
	<aside
		class="mb-6 rounded-xl border border-secondary-300 bg-secondary-100 px-4 py-3 text-sm dark:border-secondary-700 dark:bg-surface-800"
	>
		<strong class="font-semibold uppercase tracking-wide">{status}</strong>
		<span class="ml-2">This page is in progress and may change.</span>
	</aside>
{/if}

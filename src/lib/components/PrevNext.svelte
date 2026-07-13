<script lang="ts">
	import type { DocLink } from '$lib/types';

	let { prev, next } = $props<{ prev?: DocLink; next?: DocLink }>();
</script>

<nav class="mt-10 grid gap-3 sm:grid-cols-2">
	{#if prev}
		<a href={prev.url} class="rounded-xl border border-surface-200 bg-white/80 p-4 text-sm dark:border-surface-700 dark:bg-surface-800">
			<div class="text-xs uppercase tracking-wide opacity-70">Previous</div>
			<div class="font-semibold">{prev.title}</div>
		</a>
	{:else}
		<div></div>
	{/if}

	{#if next}
		<a href={next.url} class="rounded-xl border border-surface-200 bg-white/80 p-4 text-right text-sm dark:border-surface-700 dark:bg-surface-800">
			<div class="text-xs uppercase tracking-wide opacity-70">Next</div>
			<div class="font-semibold">{next.title}</div>
		</a>
	{/if}
</nav>

<script lang="ts">
	import type { TocEntry } from '$lib/types';

	let { entries } = $props<{ entries: TocEntry[] }>();
</script>

{#if entries.length > 0}
	<nav class="sticky top-20 hidden rounded-xl border border-surface-200 bg-white/70 p-4 text-sm lg:block dark:border-surface-700 dark:bg-surface-800/80">
		<h2 class="mb-3 font-semibold">On this page</h2>
		<ul class="space-y-2">
			{#each entries as item}
				<li class={item.level === 3 ? 'ml-3' : ''}>
					<a href={`#${item.id}`} class="text-surface-700 hover:text-tertiary-700 dark:text-surface-200 dark:hover:text-tertiary-300">
						{item.text}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}

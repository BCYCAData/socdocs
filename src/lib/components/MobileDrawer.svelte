<script lang="ts">
	import type { GuideNav } from '$lib/types';

	let { open, guide, currentUrl, onClose } = $props<{
		open: boolean;
		guide: GuideNav;
		currentUrl: string;
		onClose: () => void;
	}>();
</script>

{#if open}
	<button
		type="button"
		class="fixed inset-0 z-40 bg-black/40 lg:hidden"
		onclick={onClose}
		aria-label="Close menu"
	></button>
	<aside class="fixed inset-y-0 left-0 z-50 w-80 overflow-auto border-r border-surface-200 bg-white p-4 lg:hidden dark:border-surface-700 dark:bg-surface-900">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="font-semibold">{guide.title}</h2>
			<button type="button" class="rounded border border-surface-300 px-2 py-1 text-sm dark:border-surface-700" onclick={onClose}>Close</button>
		</div>
		{#each guide.sections as section}
			<div class="mb-4">
				<a href={section.url} class="block font-semibold" onclick={onClose}>{section.title}</a>
				{#each section.pages as page}
					<a
						href={page.url}
						onclick={onClose}
						class={`ml-3 mt-1 block rounded px-2 py-1 text-sm ${currentUrl === page.url ? 'bg-secondary-100 dark:bg-surface-700' : ''}`}
					>
						{page.title}
					</a>
				{/each}
			</div>
		{/each}
	</aside>
{/if}

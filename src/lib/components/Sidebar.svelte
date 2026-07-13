<script lang="ts">
	import type { GuideNav } from '$lib/types';

	let { guide, currentUrl } = $props<{ guide: GuideNav; currentUrl: string }>();
</script>

<nav class="sticky top-20 hidden max-h-[calc(100vh-6rem)] overflow-auto rounded-xl border border-surface-200 bg-white/70 p-4 text-sm lg:block dark:border-surface-700 dark:bg-surface-800/80">
	<h2 class="mb-4 font-semibold">{guide.title}</h2>
	<ul class="space-y-5">
		{#each guide.sections as section}
			<li>
				<a
					href={section.url}
					class={`block font-semibold ${currentUrl === section.url ? 'text-tertiary-700 dark:text-tertiary-300' : 'text-surface-900 dark:text-surface-100'}`}
				>
					{section.title}
				</a>
				<ul class="mt-2 space-y-1">
					{#each section.pages as page}
						<li>
							<a
								href={page.url}
								class={`block rounded px-2 py-1 ${currentUrl === page.url ? 'bg-secondary-100 text-secondary-700 dark:bg-surface-700 dark:text-secondary-300' : 'text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700'}`}
							>
								{page.title}
							</a>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
</nav>

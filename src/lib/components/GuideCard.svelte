<script lang="ts">
	import * as Lucide from '@lucide/svelte';
	import type { GuideNav } from '$lib/types';

	let { guide } = $props<{ guide: GuideNav }>();
	const iconSet = Lucide as Record<string, any>;
	const Icon = $derived(iconSet[guide.icon] ?? iconSet.BookOpenText);
</script>

<a
	href={guide.url}
	class="group block rounded-2xl border border-surface-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-secondary-300 hover:shadow-md dark:border-surface-700 dark:bg-surface-800"
>
	<div class="mb-4 inline-flex rounded-lg bg-secondary-100 p-2 text-secondary-700 dark:bg-surface-700 dark:text-secondary-300">
		<Icon size={18} />
	</div>
	<h2 class="mb-2 text-xl font-semibold">{guide.title}</h2>
	<p class="text-sm text-surface-700 dark:text-surface-200">{guide.description}</p>
</a>

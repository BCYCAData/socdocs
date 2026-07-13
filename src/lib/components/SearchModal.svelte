<script lang="ts">
	import { onMount } from 'svelte';

	type Result = {
		url: string;
		excerpt: string;
		meta?: Record<string, string>;
	};

	let { open, onClose } = $props<{ open: boolean; onClose: () => void }>();

	let query = $state('');
	let results = $state<Result[]>([]);
	let loading = $state(false);
	let errorMessage = $state('');
	let searchFn: ((term: string) => Promise<{ results: Result[] }>) | undefined;

	async function ensureSearch() {
		if (searchFn || !open) return;
		try {
			const pagefindPath = '/pagefind/pagefind.js';
			const pagefind = await import(/* @vite-ignore */ pagefindPath);
			searchFn = pagefind.search;
		} catch {
			errorMessage = 'Search index is unavailable in development until a production build is created.';
		}
	}

	async function runSearch() {
		if (!query.trim()) {
			results = [];
			return;
		}
		await ensureSearch();
		if (!searchFn) return;

		loading = true;
		const searchResult = await searchFn(query.trim());
		results = searchResult.results.slice(0, 12);
		loading = false;
	}

	$effect(() => {
		if (!open) {
			query = '';
			results = [];
			errorMessage = '';
			return;
		}
		void ensureSearch();
	});

	onMount(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
				event.preventDefault();
				if (open) onClose();
			}
			if (event.key === 'Escape' && open) {
				onClose();
			}
		};

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	});
</script>

{#if open}
	<button
		type="button"
		class="fixed inset-0 z-50 bg-black/40"
		onclick={onClose}
		aria-label="Close search"
	></button>
	<div class="fixed inset-x-4 top-20 z-50 mx-auto max-w-2xl rounded-2xl border border-surface-200 bg-white p-4 shadow-xl dark:border-surface-700 dark:bg-surface-900">
		<div class="mb-3 flex items-center gap-3">
			<input
				type="search"
				bind:value={query}
				oninput={runSearch}
				placeholder="Search docs..."
				class="w-full rounded-lg border border-surface-300 bg-transparent px-3 py-2 text-sm dark:border-surface-700"
			/>
			<button type="button" class="rounded border border-surface-300 px-3 py-2 text-sm dark:border-surface-700" onclick={onClose}>Close</button>
		</div>

		{#if errorMessage}
			<p class="rounded border border-secondary-300 bg-secondary-100 px-3 py-2 text-sm dark:border-secondary-700 dark:bg-surface-800">{errorMessage}</p>
		{:else if loading}
			<p class="text-sm opacity-70">Searching...</p>
		{:else if query.trim() && results.length === 0}
			<p class="text-sm opacity-70">No results found.</p>
		{:else}
			<ul class="max-h-[55vh] space-y-2 overflow-auto">
				{#each results as item}
					<li>
						<a href={item.url} class="block rounded-lg border border-surface-200 px-3 py-2 hover:border-secondary-300 dark:border-surface-700" onclick={onClose}>
							<div class="text-sm font-semibold">{item.meta?.title ?? item.url}</div>
							<div class="mt-1 text-sm opacity-75">{@html item.excerpt}</div>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
{/if}

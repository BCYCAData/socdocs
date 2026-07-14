<script lang="ts">
	import GuideCard from '$lib/components/GuideCard.svelte';
	import Header from '$lib/components/Header.svelte';
	import SearchModal from '$lib/components/SearchModal.svelte';

	let { data } = $props();
	let searchOpen = $state(false);
</script>

<Header guides={data.guides} onOpenSearch={() => (searchOpen = true)} />

<main class="mx-auto max-w-7xl px-4 py-10">
	<section class="relative mb-10 overflow-hidden rounded-3xl border border-primary-100 bg-white/70 p-8 shadow-sm dark:border-surface-700 dark:bg-surface-900/70">
		<div class="absolute -right-14 -top-16 h-52 w-52 rounded-full bg-secondary-300/40 blur-2xl dark:bg-secondary-700/30"></div>
		<h1 class="mb-4 text-4xl font-semibold tracking-tight">SOC Documentation</h1>
		<p class="max-w-3xl text-lg text-surface-700 dark:text-surface-200">
			A unified documentation site for residents, coordinators, administrators, and maintainers.
		</p>
	</section>

	<section class="grid gap-4 md:grid-cols-2">
		{#each data.guides as guide}
			<GuideCard {guide} />
		{/each}
	</section>
</main>

<SearchModal open={searchOpen} onOpen={() => (searchOpen = true)} onClose={() => (searchOpen = false)} />

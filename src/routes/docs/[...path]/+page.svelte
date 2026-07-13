<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Mermaid from '$lib/components/Mermaid.svelte';
	import MobileDrawer from '$lib/components/MobileDrawer.svelte';
	import OnThisPage from '$lib/components/OnThisPage.svelte';
	import PrevNext from '$lib/components/PrevNext.svelte';
	import SearchModal from '$lib/components/SearchModal.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import StubBanner from '$lib/components/StubBanner.svelte';

	let { data } = $props();
	let searchOpen = $state(false);
	let menuOpen = $state(false);
</script>

<Header
	guides={data.guides}
	activeGuide={data.activeGuide.slug}
	onOpenSearch={() => (searchOpen = true)}
	onOpenMenu={() => (menuOpen = true)}
/>

<MobileDrawer open={menuOpen} guide={data.activeGuide} currentUrl={data.page.url} onClose={() => (menuOpen = false)} />

<main class="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[16rem_1fr_14rem]">
	<Sidebar guide={data.activeGuide} currentUrl={data.page.url} />

	<article data-pagefind-meta={`guide:${data.activeGuide.slug}`} data-pagefind-ignore={data.page.status === 'stub' ? true : undefined}>
		<header class="mb-6 rounded-2xl border border-surface-200 bg-white/70 p-6 dark:border-surface-700 dark:bg-surface-900/60">
			<p class="text-xs uppercase tracking-wide text-surface-500">{data.activeGuide.title}</p>
			<h1 class="mt-2 text-3xl font-semibold">{data.page.title}</h1>
			<p class="mt-3 text-surface-700 dark:text-surface-200">{data.page.description}</p>
		</header>

		<StubBanner status={data.page.status} />

		<Mermaid html={data.page.html ?? ''} />

		<PrevNext prev={data.page.prev} next={data.page.next} />
	</article>

	<OnThisPage entries={data.page.toc ?? []} />
</main>

<SearchModal open={searchOpen} onClose={() => (searchOpen = false)} />

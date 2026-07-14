<script lang="ts">
	import * as Lucide from '@lucide/svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import type { GuideNav } from '$lib/types';

	let {
		guides,
		activeGuide,
		onOpenSearch,
		onOpenMenu
	} = $props<{
		guides: GuideNav[];
		activeGuide?: string;
		onOpenSearch: () => void;
		onOpenMenu?: () => void;
	}>();

	const iconSet = Lucide as Record<string, any>;
</script>

<header class="sticky top-0 z-30 border-b border-surface-200/80 bg-white/90 backdrop-blur dark:border-surface-700 dark:bg-surface-900/80">
	<div class="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
		{#if onOpenMenu}
			<button
				type="button"
				class="rounded-lg border border-surface-300 px-2 py-1 text-sm lg:hidden dark:border-surface-700"
				onclick={onOpenMenu}
			>
				Menu
			</button>
		{/if}
		<a href="/" class="flex items-center gap-2 text-lg font-semibold tracking-tight">
			<img src="/images/brand/SOCLogo_quarter.png" alt="" class="h-6 w-6" width="24" height="24" />
			SOC Docs
		</a>

		<nav class="hidden flex-wrap items-center gap-2 md:flex">
			{#each guides as guide}
				{@const Icon = iconSet[guide.icon] ?? iconSet.BookOpenText}
				<a
					href={guide.url}
					class={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold ${activeGuide === guide.slug ? 'bg-primary-100 text-primary-700 dark:bg-surface-700 dark:text-primary-300' : 'text-surface-700 hover:bg-surface-100 dark:text-surface-200 dark:hover:bg-surface-700'}`}
				>
					<Icon size={15} />
					{guide.title}
				</a>
			{/each}
		</nav>

		<div class="ml-auto flex items-center gap-2">
			<button
				type="button"
				class="rounded-lg border border-surface-300 bg-white/80 px-3 py-2 text-sm font-semibold dark:border-surface-700 dark:bg-surface-800"
				onclick={onOpenSearch}
			>
				Search
				<span class="ml-1 opacity-70">Ctrl+K</span>
			</button>
			<ThemeToggle />
		</div>
	</div>
</header>

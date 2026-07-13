<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';

	function setTheme(next: 'light' | 'dark') {
		document.documentElement.classList.toggle('dark', next === 'dark');
		document.documentElement.setAttribute('data-theme', next);
		localStorage.setItem('socdocs-theme', next);
		window.dispatchEvent(new Event('socdocs:theme'));
	}

	function toggleTheme() {
		const dark = document.documentElement.classList.contains('dark');
		setTheme(dark ? 'light' : 'dark');
	}
</script>

<button
	type="button"
	class="inline-flex items-center gap-2 rounded-lg border border-surface-200 bg-white/80 px-3 py-2 text-sm font-semibold text-surface-950 shadow-sm hover:bg-white dark:border-surface-700 dark:bg-surface-800 dark:text-surface-50"
	onclick={toggleTheme}
>
	<Sun size={16} class="dark:hidden" />
	<Moon size={16} class="hidden dark:block" />
	<span class="hidden sm:inline">Theme</span>
</button>

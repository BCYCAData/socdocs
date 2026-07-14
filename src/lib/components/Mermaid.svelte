<script lang="ts">
	import { onMount, tick } from 'svelte';

	let { html } = $props<{ html: string }>();
	let root: HTMLElement | undefined;
	let mermaid: any;
	let queue: Promise<void> = Promise.resolve();

	function scheduleRender() {
		queue = queue.then(renderDiagrams).catch((error) => {
			console.error('Mermaid rendering failed', error);
		});
	}

	async function renderDiagrams() {
		if (!root) return;

		const nodes = Array.from(root.querySelectorAll('pre.mermaid[data-diagram]')) as HTMLElement[];
		if (nodes.length === 0) return;

		if (!mermaid) {
			const module = await import('mermaid');
			mermaid = module.default;
		}

		mermaid.initialize({
			startOnLoad: false,
			theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
			securityLevel: 'loose'
		});

		// mermaid.run replaces each pre's content with an svg, so stash the
		// diagram source and restore it before every run — otherwise re-renders
		// (theme change, back-navigation) would try to parse the svg markup.
		for (const node of nodes) {
			if (node.dataset.diagramSrc === undefined) {
				node.dataset.diagramSrc = node.textContent ?? '';
			}
			node.removeAttribute('data-processed');
			node.textContent = node.dataset.diagramSrc;
		}
		await mermaid.run({ nodes });
	}

	$effect(() => {
		// Read html synchronously: reads after an await are not tracked, and
		// without this the effect never re-fires on client-side navigation.
		void html;
		void (async () => {
			await tick();
			scheduleRender();
		})();
	});

	onMount(() => {
		const handleTheme = () => scheduleRender();
		window.addEventListener('socdocs:theme', handleTheme);
		return () => window.removeEventListener('socdocs:theme', handleTheme);
	});
</script>

<div bind:this={root} class="prose max-w-none dark:prose-invert">
	{@html html}
</div>

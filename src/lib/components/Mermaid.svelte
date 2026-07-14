<script lang="ts">
	import { onMount, tick } from 'svelte';

	let { html } = $props<{ html: string }>();
	let root: HTMLElement | undefined;
	let mermaid: any;
	let lastSignature = '';

	async function renderDiagrams() {
		if (!root) return;

		const nodes = Array.from(root.querySelectorAll('pre.mermaid[data-diagram]')) as HTMLElement[];
		if (nodes.length === 0) return;

		const signature = `${document.documentElement.classList.contains('dark')}-${html}`;
		if (signature === lastSignature) return;
		lastSignature = signature;

		if (!mermaid) {
			const module = await import('mermaid');
			mermaid = module.default;
		}

		mermaid.initialize({
			startOnLoad: false,
			theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
			securityLevel: 'loose'
		});

		for (const node of nodes) {
			node.removeAttribute('data-processed');
		}
		await mermaid.run({ nodes });
	}

	$effect(() => {
		void (async () => {
			await tick();
			await renderDiagrams();
		})();
	});

	onMount(() => {
		const handleTheme = () => {
			lastSignature = '';
			void renderDiagrams();
		};
		window.addEventListener('socdocs:theme', handleTheme);
		void renderDiagrams();
		return () => window.removeEventListener('socdocs:theme', handleTheme);
	});
</script>

<div bind:this={root} class="prose max-w-none dark:prose-invert">
	{@html html}
</div>

import rehypeShiki from '@shikijs/rehype';
import type { Root as HastRoot } from 'hast';
import { h } from 'hastscript';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import type { Plugin } from 'unified';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import type { TocEntry } from '$lib/types';

function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

const remarkMermaidFence: Plugin = () => {
	return (tree) => {
		visit(tree, 'code', (node: { lang?: string; value?: string }, index, parent) => {
			if (!parent || index === undefined || node.lang !== 'mermaid') {
				return;
			}

			const safeValue = escapeHtml(node.value ?? '');
			(parent as any).children[index] = {
				type: 'html',
				value: `<pre class=\"mermaid\" data-diagram>${safeValue}</pre>`
			};
		});
	};
};

const rehypeDocEnhancements: Plugin<[], HastRoot> = () => {
	return (tree, file) => {
		const toc: TocEntry[] = [];

		visit(tree, 'element', (node: any) => {
			if (node.tagName === 'img') {
				node.properties = {
					...(node.properties ?? {}),
					loading: 'lazy',
					decoding: 'async'
				};
			}

			if (node.tagName === 'p') {
				const first = node.children?.[0];
				const second = node.children?.[1];
				if (first?.tagName === 'img' && second?.type === 'text') {
					node.tagName = 'figure';
					node.children = [
						first,
						h('figcaption', { class: 'text-sm opacity-70' }, second.value.trim())
					];
				}
			}

			if (node.tagName === 'h2' || node.tagName === 'h3') {
				const id = node.properties?.id;
				if (typeof id === 'string') {
					const text = collectText(node).trim();
					toc.push({ id, text, level: node.tagName === 'h2' ? 2 : 3 });
				}
			}
		});

		file.data.toc = toc;
	};
};

function collectText(node: any): string {
	if (!node) return '';
	if (node.type === 'text') return node.value ?? '';
	if (!Array.isArray(node.children)) return '';
	return node.children.map((child: any) => collectText(child)).join('');
}

export async function renderMarkdown(markdown: string): Promise<{
	html: string;
	toc: TocEntry[];
}> {
	const file = await unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkMermaidFence)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeSlug)
		.use(rehypeAutolinkHeadings, { behavior: 'append' })
		.use(rehypeDocEnhancements)
		.use(rehypeShiki, {
			themes: { light: 'github-light', dark: 'github-dark' }
		})
		.use(rehypeStringify, { allowDangerousHtml: true })
		.process(markdown);

	return {
		html: String(file),
		toc: (file.data.toc as TocEntry[] | undefined) ?? []
	};
}

import matter from 'gray-matter';
import { guideMap, guides } from '$lib/guides';
import { renderMarkdown } from '$lib/server/content/markdown';
import type {
	DocLink,
	DocPage,
	DocStatus,
	Frontmatter,
	GuideNav,
	GuideSlug,
	NavSection
} from '$lib/types';

type RawDoc = {
	guide: GuideSlug;
	relativePath: string;
	filePath: string;
	url: string;
	frontmatter: Frontmatter;
	status: DocStatus;
	body: string;
	order: number[];
	sectionDir?: string;
	isGuideIndex: boolean;
	isSectionIndex: boolean;
};

type ContentCache = {
	pagesByUrl: Map<string, DocPage>;
	navByGuide: Map<GuideSlug, GuideNav>;
	sectionLandingByUrl: Map<string, DocPage>;
	orderedDocsByGuide: Map<GuideSlug, DocPage[]>;
	allPaths: string[];
};

let cache: ContentCache | undefined;

function stripOrderPrefix(value: string): string {
	return value.replace(/^\d+-/, '');
}

function getOrder(part: string): number {
	const match = part.match(/^(\d+)-/);
	return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function toUrlSegment(part: string): string {
	const stripped = stripOrderPrefix(part);
	return stripped.toLowerCase();
}

function parseFrontmatter(
	raw: string,
	path: string
): { frontmatter: Frontmatter; body: string; status: DocStatus } {
	const parsed = matter(raw);
	const frontmatter = parsed.data as Frontmatter;

	if (!frontmatter.title || !frontmatter.description) {
		throw new Error(`Missing required frontmatter keys in ${path}`);
	}

	const status = frontmatter.status ?? 'complete';
	if (!['stub', 'draft', 'complete'].includes(status)) {
		throw new Error(`Invalid status '${String(frontmatter.status)}' in ${path}`);
	}

	// pending is the safe default: pages must opt out of the screenshot backlog explicitly
	const screenshots = frontmatter.screenshots ?? 'pending';
	if (!['none', 'pending', 'done'].includes(screenshots)) {
		throw new Error(`Invalid screenshots '${String(frontmatter.screenshots)}' in ${path}`);
	}

	return { frontmatter, body: parsed.content.trim(), status: status as DocStatus };
}

function loadRawDocs(): RawDoc[] {
	const modules = import.meta.glob('/content/docs/**/*.md', {
		eager: true,
		query: '?raw',
		import: 'default'
	}) as Record<string, string>;

	const docs: RawDoc[] = [];
	const urlSet = new Set<string>();

	for (const [filePath, raw] of Object.entries(modules)) {
		const relativePath = filePath.replace('/content/docs/', '');
		const parts = relativePath.split('/');
		const guide = parts[0] as GuideSlug;
		if (!guideMap.has(guide)) {
			throw new Error(`Unknown guide '${guide}' in ${filePath}`);
		}

		const filename = parts[parts.length - 1] ?? '';
		const baseName = filename.replace(/\.md$/, '');
		const parentParts = parts.slice(1, -1);
		const sectionDir = parentParts[0];
		const isIndex = baseName === 'index';
		const isGuideIndex = isIndex && parts.length === 2;
		const isSectionIndex = isIndex && parts.length === 3;

		const urlParts = [guide, ...parentParts.map(toUrlSegment)];
		if (!isIndex) {
			urlParts.push(toUrlSegment(baseName));
		}
		const url = `/docs/${urlParts.join('/')}`;
		if (urlSet.has(url)) {
			throw new Error(`Duplicate URL '${url}' generated from ${filePath}`);
		}
		urlSet.add(url);

		const order = [
			...parentParts.map(getOrder),
			isIndex ? -1 : getOrder(baseName),
			parts.length,
			filePath.length
		];

		const { frontmatter, body, status } = parseFrontmatter(raw, filePath);

		docs.push({
			guide,
			relativePath,
			filePath,
			url,
			frontmatter,
			status,
			body,
			order,
			sectionDir,
			isGuideIndex,
			isSectionIndex
		});
	}

	for (const guide of guides) {
		const hasGuideIndex = docs.some((doc) => doc.guide === guide.slug && doc.isGuideIndex);
		if (!hasGuideIndex) {
			throw new Error(`Guide '${guide.slug}' is missing content/docs/${guide.slug}/index.md`);
		}
	}

	const sectionKeys = new Set(
		docs.filter((doc) => doc.sectionDir).map((doc) => `${doc.guide}/${doc.sectionDir}`)
	);

	for (const key of sectionKeys) {
		const [guide, sectionDir] = key.split('/');
		const hasSectionIndex = docs.some(
			(doc) => doc.guide === guide && doc.sectionDir === sectionDir && doc.isSectionIndex
		);
		if (!hasSectionIndex) {
			throw new Error(`Section '${key}' is missing an index.md page`);
		}
	}

	return docs.sort((a, b) => a.url.localeCompare(b.url));
}

async function buildCache(): Promise<ContentCache> {
	const rawDocs = loadRawDocs();
	const pagesByUrl = new Map<string, DocPage>();
	const sectionLandingByUrl = new Map<string, DocPage>();

	for (const rawDoc of rawDocs) {
		const rendered = await renderMarkdown(rawDoc.body);
		pagesByUrl.set(rawDoc.url, {
			guide: rawDoc.guide,
			url: rawDoc.url,
			title: rawDoc.frontmatter.title,
			description: rawDoc.frontmatter.description,
			status: rawDoc.status,
			sourcePath: rawDoc.relativePath,
			body: rawDoc.body,
			html: rendered.html,
			toc: rendered.toc
		});
	}

	const navByGuide = new Map<GuideSlug, GuideNav>();
	const orderedDocsByGuide = new Map<GuideSlug, DocPage[]>();
	const allPaths: string[] = [];

	for (const guide of guides) {
		const guideDocs = rawDocs
			.filter((doc) => doc.guide === guide.slug)
			.sort((a, b) => compareOrder(a.order, b.order) || a.url.localeCompare(b.url));

		const guideIndex = guideDocs.find((doc) => doc.isGuideIndex);
		if (!guideIndex) {
			throw new Error(`Missing guide index for ${guide.slug}`);
		}

		const sectionDocs = guideDocs.filter((doc) => doc.sectionDir);
		const sectionDirs = [...new Set(sectionDocs.map((doc) => doc.sectionDir as string))].sort(
			(a, b) => compareOrder([getOrder(a)], [getOrder(b)])
		);

		const sections: NavSection[] = [];
		for (const sectionDir of sectionDirs) {
			const docsInSection = sectionDocs
				.filter((doc) => doc.sectionDir === sectionDir)
				.sort((a, b) => compareOrder(a.order, b.order));
			const sectionIndex = docsInSection.find((doc) => doc.isSectionIndex);
			if (!sectionIndex) continue;

			const sectionPage = pagesByUrl.get(sectionIndex.url);
			if (!sectionPage) continue;
			sectionLandingByUrl.set(sectionPage.url, sectionPage);

			const pages = docsInSection
				.filter((doc) => !doc.isSectionIndex)
				.map((doc) => ({
					url: doc.url,
					title: doc.frontmatter.title
				}));

			sections.push({
				slug: stripOrderPrefix(sectionDir),
				title: sectionPage.title,
				description: sectionPage.description,
				url: sectionPage.url,
				pages
			});
		}

		const guidePage = pagesByUrl.get(guideIndex.url);
		if (!guidePage) {
			throw new Error(`Guide landing page missing for ${guide.slug}`);
		}

		navByGuide.set(guide.slug, {
			slug: guide.slug,
			title: guide.title,
			description: guide.description,
			url: guideIndex.url,
			icon: guide.icon,
			sections
		});

		const orderedGuideDocs: DocPage[] = [guidePage];
		const guidePages: DocPage[] = [];
		allPaths.push(guideIndex.url.replace('/docs/', ''));
		for (const section of sections) {
			allPaths.push(section.url.replace('/docs/', ''));
			const sectionPage = pagesByUrl.get(section.url);
			if (sectionPage) orderedGuideDocs.push(sectionPage);
			for (const page of section.pages) {
				allPaths.push(page.url.replace('/docs/', ''));
				const docPage = pagesByUrl.get(page.url);
				if (docPage) {
					orderedGuideDocs.push(docPage);
					guidePages.push(docPage);
				}
			}
		}
		orderedDocsByGuide.set(guide.slug, orderedGuideDocs);

		// prev/next stays within the guide; section and guide indexes are skipped
		for (let index = 0; index < guidePages.length; index += 1) {
			const current = guidePages[index];
			const prev = guidePages[index - 1];
			const next = guidePages[index + 1];
			current.prev = prev ? toDocLink(prev) : undefined;
			current.next = next ? toDocLink(next) : undefined;
		}
	}

	return {
		pagesByUrl,
		navByGuide,
		sectionLandingByUrl,
		orderedDocsByGuide,
		allPaths
	};
}

function compareOrder(a: number[], b: number[]): number {
	const max = Math.max(a.length, b.length);
	for (let i = 0; i < max; i += 1) {
		const aValue = a[i] ?? Number.MAX_SAFE_INTEGER;
		const bValue = b[i] ?? Number.MAX_SAFE_INTEGER;
		if (aValue !== bValue) return aValue - bValue;
	}
	return 0;
}

function toDocLink(page: DocPage): DocLink {
	return { title: page.title, url: page.url };
}

async function getCache(): Promise<ContentCache> {
	if (!cache) {
		cache = await buildCache();
	}
	return cache;
}

export async function getGuideNavs(): Promise<GuideNav[]> {
	const content = await getCache();
	return guides
		.map((guide) => content.navByGuide.get(guide.slug))
		.filter((value): value is GuideNav => Boolean(value));
}

export async function getSectionLanding(url: string): Promise<DocPage | undefined> {
	const content = await getCache();
	return content.sectionLandingByUrl.get(url);
}

export async function getDocPage(url: string): Promise<DocPage | undefined> {
	const content = await getCache();
	return content.pagesByUrl.get(url);
}

export async function getAllPrerenderPaths(): Promise<string[]> {
	const content = await getCache();
	return [...content.allPaths];
}

export async function getLlmsIndex(): Promise<string> {
	const content = await getCache();
	const lines = ['# SOC Documentation', ''];
	for (const guide of guides) {
		const docs = content.orderedDocsByGuide.get(guide.slug) ?? [];
		lines.push(`## ${guide.title}`, '');
		for (const doc of docs) {
			lines.push(`- [${doc.title}](${doc.url}): ${doc.description}`);
		}
		lines.push('');
	}
	return lines.join('\n');
}

export async function getLlmsFull(): Promise<string> {
	const content = await getCache();
	const chunks = ['# SOC Documentation Full Text'];
	for (const guide of guides) {
		const docs = content.orderedDocsByGuide.get(guide.slug) ?? [];
		for (const doc of docs) {
			chunks.push(`## ${doc.title}\n\nURL: ${doc.url}\n\n${doc.body}`);
		}
	}
	return chunks.join('\n\n') + '\n';
}

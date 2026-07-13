import { error } from '@sveltejs/kit';
import { getAllPrerenderPaths, getDocPage, getGuideNavs, getSectionLanding } from '$lib/server/content';
import { guideMap } from '$lib/guides';
import type { GuideSlug } from '$lib/types';

export async function entries() {
	const paths = await getAllPrerenderPaths();
	return paths.map((path) => ({ path }));
}

export async function load({ params }) {
	const path = params.path?.trim();
	if (!path) {
		throw error(404, 'Not found');
	}

	const segments = path.split('/').filter(Boolean);
	const guide = segments[0] as GuideSlug;
	if (!guideMap.has(guide)) {
		throw error(404, 'Not found');
	}

	const url = `/docs/${segments.join('/')}`;
	const [guides, page, sectionLanding] = await Promise.all([
		getGuideNavs(),
		getDocPage(url),
		getSectionLanding(url)
	]);

	if (!page) {
		throw error(404, 'Not found');
	}

	const activeGuide = guides.find((item) => item.slug === guide);
	if (!activeGuide) {
		throw error(404, 'Not found');
	}

	return {
		guides,
		activeGuide,
		page,
		isGuideLanding: activeGuide.url === url,
		isSectionLanding: Boolean(sectionLanding)
	};
}

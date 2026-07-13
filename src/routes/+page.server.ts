import { getGuideNavs } from '$lib/server/content';

export async function load() {
	return {
		guides: await getGuideNavs()
	};
}

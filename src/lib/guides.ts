import type { GuideSlug } from '$lib/types';

export type GuideDefinition = {
	slug: GuideSlug;
	title: string;
	description: string;
	icon: string;
};

export const guides: GuideDefinition[] = [
	{
		slug: 'user',
		title: 'User Guide',
		description: 'Help for residents using SOC day-to-day features.',
		icon: 'BookUser'
	},
	{
		slug: 'admin',
		title: 'Administrator Guide',
		description: 'Operational workflows for coordinators and site admins.',
		icon: 'ShieldCheck'
	},
	{
		slug: 'technical',
		title: 'Technical Guide',
		description: 'Architecture, data, and development conventions.',
		icon: 'Code2'
	},
	{
		slug: 'project',
		title: 'Project Guide',
		description: 'Background, outcomes, and delivery context for SOC.',
		icon: 'ScrollText'
	}
];

export const guideMap = new Map(guides.map((guide) => [guide.slug, guide]));

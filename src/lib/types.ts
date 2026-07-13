export type GuideSlug = 'user' | 'admin' | 'technical' | 'project';

export type DocStatus = 'stub' | 'draft' | 'complete';

export type Frontmatter = {
	title: string;
	description: string;
	status?: DocStatus;
};

export type TocEntry = {
	id: string;
	text: string;
	level: 2 | 3;
};

export type DocPage = {
	guide: GuideSlug;
	url: string;
	title: string;
	description: string;
	status: DocStatus;
	sourcePath: string;
	body: string;
	html?: string;
	toc?: TocEntry[];
	hasMermaid?: boolean;
	prev?: DocLink;
	next?: DocLink;
};

export type DocLink = {
	url: string;
	title: string;
};

export type NavPage = DocLink;

export type NavSection = {
	slug: string;
	title: string;
	description: string;
	url: string;
	pages: NavPage[];
};

export type GuideNav = {
	slug: GuideSlug;
	title: string;
	description: string;
	url: string;
	icon: string;
	sections: NavSection[];
};

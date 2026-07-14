import { readFile } from 'node:fs/promises';
import { globSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIR = 'content/docs';
const STATIC_DIR = path.resolve('static');
const STATUSES = ['stub', 'draft', 'complete'];
const SCREENSHOT_STATES = ['none', 'pending', 'done'];

// only actual embeds count; prose mentions of /images/docs/ paths (e.g. workflow docs) do not
function collectDocImages(body) {
	const embeds = [
		...body.matchAll(/!\[[^\]]*\]\((\/images\/docs\/[^\s)]+)\)/g),
		...body.matchAll(/<img[^>]+src="(\/images\/docs\/[^"]+)"/g)
	];
	return embeds.map((match) => match[1]);
}

async function main() {
	const files = globSync(`${CONTENT_DIR}/**/*.md`).sort();
	const counts = new Map();
	const backlog = [];
	const violations = [];

	for (const file of files) {
		const raw = await readFile(file, 'utf8');
		const parsed = matter(raw);
		const status = parsed.data.status ?? 'complete';
		const screenshots = parsed.data.screenshots ?? 'pending';

		if (!STATUSES.includes(status)) {
			violations.push(`${file}: invalid status '${status}'`);
			continue;
		}
		if (!SCREENSHOT_STATES.includes(screenshots)) {
			violations.push(`${file}: invalid screenshots '${screenshots}'`);
			continue;
		}

		const key = `${status} / ${screenshots}`;
		counts.set(key, (counts.get(key) ?? 0) + 1);

		const images = collectDocImages(parsed.content);
		if (screenshots === 'done' && images.length === 0) {
			violations.push(`${file}: screenshots done but no /images/docs/ reference in body`);
		}
		if (screenshots === 'none' && images.length > 0) {
			violations.push(`${file}: screenshots none but body references ${images[0]}`);
		}
		for (const image of images) {
			const target = path.join(STATIC_DIR, image);
			if (!globSync(target).length) {
				violations.push(`${file}: referenced image missing on disk: ${image}`);
			}
		}

		if (status === 'complete' && screenshots === 'pending') {
			backlog.push(file);
		}
	}

	console.log(`Status report for ${files.length} pages:`);
	for (const key of [...counts.keys()].sort()) {
		console.log(`- ${key}: ${counts.get(key)}`);
	}

	if (backlog.length > 0) {
		console.log(`\nScreenshot backlog (${backlog.length} complete pages awaiting captures):`);
		for (const file of backlog) {
			console.log(`- ${file}`);
		}
	}

	if (violations.length > 0) {
		console.error('\nStatus violations detected:');
		for (const violation of violations) {
			console.error(`- ${violation}`);
		}
		process.exit(1);
	}

	console.log('\nStatus check passed.');
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});

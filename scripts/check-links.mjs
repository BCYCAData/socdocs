import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const BUILD_DIR = path.resolve('build');

async function walk(dir, output = []) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			await walk(fullPath, output);
		} else {
			output.push(fullPath);
		}
	}
	return output;
}

function collectInternalLinks(html) {
	const hrefs = [...html.matchAll(/(?:href|src)=\"([^\"]+)\"/g)].map((match) => match[1]);
	return hrefs.filter(
		(link) =>
			link.startsWith('/') &&
			!link.startsWith('//') &&
			!link.startsWith('/#') &&
			!link.startsWith('/http') &&
			!link.startsWith('/mailto:')
	);
}

async function exists(targetPath) {
	try {
		await stat(targetPath);
		return true;
	} catch {
		return false;
	}
}

function candidatePaths(link) {
	if (link.endsWith('/')) {
		return [path.join(BUILD_DIR, link, 'index.html')];
	}
	return [
		path.join(BUILD_DIR, link),
		path.join(BUILD_DIR, link, 'index.html'),
		path.join(BUILD_DIR, `${link}.html`)
	];
}

async function main() {
	const files = await walk(BUILD_DIR);
	const htmlFiles = files.filter((file) => file.endsWith('.html'));
	const missing = [];

	for (const file of htmlFiles) {
		const html = await readFile(file, 'utf8');
		for (const link of collectInternalLinks(html)) {
			const candidates = candidatePaths(link);
			let found = false;
			for (const candidate of candidates) {
				if (await exists(candidate)) {
					found = true;
					break;
				}
			}
			if (!found) {
				missing.push({ file, link });
			}
		}
	}

	if (missing.length > 0) {
		console.error('Broken internal links detected:');
		for (const issue of missing) {
			console.error(`- ${issue.file} -> ${issue.link}`);
		}
		process.exit(1);
	}

	console.log(`Link check passed (${htmlFiles.length} HTML files scanned).`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const htmlFiles = [];

async function walk(directory) {
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const target = path.join(directory, entry.name);
		if (entry.isDirectory()) await walk(target);
		else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(target);
	}
}

function pagePath(urlPath) {
	const decoded = decodeURIComponent(urlPath);
	if (path.extname(decoded)) return path.join(root, decoded);
	return path.join(root, decoded, 'index.html');
}

await walk(root);
const failures = [];

for (const file of htmlFiles) {
	const html = await readFile(file, 'utf8');
	const ids = new Set([...html.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]));
	const sourceUrl = `/${path.relative(root, file).replace(/index\.html$/, '').replaceAll(path.sep, '/')}`;

	for (const match of html.matchAll(/\s(?:href|src)=["']([^"']+)["']/g)) {
		const target = match[1];
		if (/^(?:https?:|mailto:|tel:|data:|javascript:)/.test(target)) continue;
		const resolved = new URL(target, `https://usetycho.com${sourceUrl}`);
		if (resolved.origin !== 'https://usetycho.com') continue;

		try {
			const targetHtml = await readFile(pagePath(resolved.pathname), 'utf8');
			if (resolved.hash) {
				const fragment = decodeURIComponent(resolved.hash.slice(1));
				const targetIds = resolved.pathname === new URL(`https://usetycho.com${sourceUrl}`).pathname
					? ids
					: new Set([...targetHtml.matchAll(/\sid=["']([^"']+)["']/g)].map((item) => item[1]));
				if (!targetIds.has(fragment)) failures.push(`${sourceUrl} -> missing fragment ${resolved.pathname}${resolved.hash}`);
			}
		} catch {
			failures.push(`${sourceUrl} -> missing ${resolved.pathname}`);
		}
	}
}

if (failures.length) {
	console.error(`Internal link check failed:\n${failures.map((item) => `- ${item}`).join('\n')}`);
	process.exitCode = 1;
} else {
	console.log(`Checked ${htmlFiles.length} generated HTML pages; internal links and fragments are valid.`);
}

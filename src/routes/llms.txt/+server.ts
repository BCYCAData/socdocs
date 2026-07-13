import { getLlmsIndex } from '$lib/server/content';

export const prerender = true;

export async function GET() {
	const body = await getLlmsIndex();
	return new Response(body, {
		headers: {
			'content-type': 'text/plain; charset=utf-8'
		}
	});
}

import { getLlmsFull } from '$lib/server/content';

export const prerender = true;

export async function GET() {
	const body = await getLlmsFull();
	return new Response(body, {
		headers: {
			'content-type': 'text/plain; charset=utf-8'
		}
	});
}

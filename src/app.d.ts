// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '/pagefind/pagefind.js' {
	export function search(term: string): Promise<{
		results: Array<{
			url: string;
			excerpt: string;
			meta?: Record<string, string>;
		}>;
	}>;
}

export {};

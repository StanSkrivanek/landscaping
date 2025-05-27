import { getPage } from '$lib/server/sanityClient';

export async function load() {
	const pageContent = await getPage('terms');
	console.log(pageContent, 'pageContent');
	return {
		isLoading: false,
		pageContent
	};
}

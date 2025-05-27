import { getPage } from '$lib/server/sanityClient';

export async function load() {
	const pageContent = await getPage('privacy');
	console.log(pageContent, 'pageContent');
	return {
		isLoading: false,
		pageContent
	};
}

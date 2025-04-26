import { getFiveServices } from '$lib/server/sanityClient';

export async function load() {
	const services = await getFiveServices();
	// console.log('Fetched recipes:', recipes);
	return {
		isLoading: false,
		services
	};
}

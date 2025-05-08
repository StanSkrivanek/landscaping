import { getAllServices, getHero } from '$lib/server/sanityClient';

export async function load() {
	const services = await getAllServices();
	const hero = await getHero('services');

	return {
		isLoading: false,
		services,
		hero
	};
}

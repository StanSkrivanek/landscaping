import { getFiveServices, getHero } from '$lib/server/sanityClient';

export async function load() {
	const services = await getFiveServices();
	const hero = await getHero('home');

	return {
		isLoading: false,
		services,
		hero
	};
}

import { getFiveServices, getHero } from '$lib/server/sanityClient';

export async function load() {
	const services = await getFiveServices();
	const hero = await getHero('home');
	// console.log('HERO:', hero);
	console.log('SERVICES:', services);
	return {
		isLoading: false,
		services,
		hero
	};
}

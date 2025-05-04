import { getHero, getService } from '$lib/server/sanityClient';

export async function load({ params }) {
	const service = await getService(params.slug);
	const hero = await getHero(params.slug);
	console.log(service);
	return {
		isLoading: false,
		service,
		hero
	};
}

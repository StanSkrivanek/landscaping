import { getAllTestimonials, getFiveServices, getHero } from '$lib/server/sanityClient';

export async function load() {
	const services = await getFiveServices();
	const hero = await getHero('home');
	const testimonials = await getAllTestimonials();

	return {
		isLoading: false,
		hero,
		services,
		testimonials
	};
}

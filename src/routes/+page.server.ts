import { getAllTestimonials, getFiveServices, getHero } from '$lib/server/sanityClient';

export async function load() {
	const services = await getFiveServices();
	const hero = await getHero('home');
	const testimonials = await getAllTestimonials();
	console.log("🚀 ~ load ~ testimonials:", testimonials)

	return {
		isLoading: false,
		hero,
		services,
		testimonials
	};
}

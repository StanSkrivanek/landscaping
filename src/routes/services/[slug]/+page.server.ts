import { getAllServices, getServiceBySlug } from '$lib/server/sanityClient';

export async function load({ params }) {
	const allServices = await getAllServices();
	const service = await getServiceBySlug(params.slug);

	return {
		// isLoading: false,
		service,
		allServices,
		
	};
}

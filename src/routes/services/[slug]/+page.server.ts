import { getServiceBySlug } from '$lib/server/sanityClient';

export async function load({ params }) {
	const service = await getServiceBySlug(params.slug);
	console.log("🚀 ~ load ~ service:", service)
	return {
		// isLoading: false,
		service,
		
	};
}

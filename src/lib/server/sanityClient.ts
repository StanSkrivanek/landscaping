// All queries are defined here
// import { env as envPublic } from '$env/dynamic/public';
// create Sanity client
import { createClient } from '@sanity/client';

const client = createClient({
	projectId: 'lbo1agd3', // Replace with your Sanity project ID
	dataset: 'production', // Replace with your Sanity dataset name
	// apiVersion: envPublic.PUBLIC_SANITY_API_VERSION, //  can be public - use a UTC date string
	useCdn: true // `true` for faster, cached responses
	// token: envPrivate.SANITY_TOKEN // Uncomment this line if you need to use a token for authentication
	// withCredentials: true // Uncomment this line if you need to use credentials
	// ignoreBrowserTokenWarning: true, // Uncomment this line if you need to ignore the warning
});
export const getFiveServices = async () => {
	const query = `*[_type == "service"][0...5]{
        "id": _id,
            "slug": slug.current,
            title,
            "thumb": thumbnail.asset->url,
            "shorts": shortDescription[]{
                "text": children[].text
            },
        }`;
	try {
		const services = await client.fetch(query);
		console.log('Fetched services:', services);
		return services;
	} catch (err) {
		console.error('Error fetching recipes:', err);
		return [];
	}
};

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

// -------------------------------------------------------- 
// 	QUERIES
// --------------------------------------------------------


// --- PAGES ---

// get hero for SINGLE page
export const getHero = async (page: string) => {
	const query = `*[_type == "hero" && title == $page][0]{
		"id": _id,
			"page": title,
			"headline": headline,
			"mainImage": mainImage.asset->url,
			"introduction": introduction[]{
			...,
			}
	}`;
	try {
		const hero = await client.fetch(query, { page });
		// console.log('Fetched hero:', hero);
		return hero;
	} catch (err) {
		console.error('Error fetching recipes:', err);
		return [];
	}
};

// --- SERVICES ---

// get all projects
export const getAllServices = async () => {
	const query = `*[_type == "service"] | order(position asc){
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
		// console.log('Fetched services:', services);
		return services;
	} catch (err) {
		console.error('Error fetching recipes:', err);
		return [];
	}
};

// get services with a limit of 5
export const getFiveServices = async () => {
	const query = `*[_type == "service"][0...5] | order(position asc){
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
		// console.log('Fetched services:', services);
		return services;
	} catch (err) {
		console.error('Error fetching recipes:', err);
		return [];
	}
};

// get service by slug
export const getServiceBySlug = async (slug: string) => {
	const query = `*[_type == "service" && slug.current == $slug][0]{
		"id": _id,
		title,
		headline,
		"slug": slug.current,
		"description": description[]{
				...,
			},
		"thumb": thumbnail.asset->url,
		"mainImage": mainImage.asset->url,
		"gallery": gallery[]{
			"imageUrl": asset->url
		}
	}`;
	try {
		const service = await client.fetch(query, { slug });
		return service;
	} catch (err) {
		console.error('Error fetching recipes:', err);
		return [];
	}
};

// getService -> shorts
// "shorts": shortDescription[]{
// 	"shortText": children[]{
// 		text
// 	}
// },



// --- PROJECTS ---

// get all Projects
export const getAllProjects = async () => {
	const query = `*[_type == "project"] | order(position asc){
			"id": _id,
			isFeatured,
			"slug": slug.current,
			"premiseType": premiseType{
				_type == "reference" =>  @->{type},		
              },
			"location": location,
			"thumb": thumbnail.asset->url,
		}`;
	try {
		const projects = await client.fetch(query);
		// console.log('Fetched projects:', projects);
		return projects;
	} catch (err) {
		console.error('Error fetching recipes:', err);
		return [];
	}
};

// get project by slug
export const getProjectBySlug = async (slug: string) => {
	const query = `*[_type == "project" && slug.current == $slug][0]{
			"id": _id,
			"slug": slug.current,
			"premiseType": premiseType{
				_type == "reference" =>  @->{type},
					
              },
			"location": location,
			"overview": overview,
			"thumb": thumbnail.asset->url,
			"mainImage": mainImage.asset->url,
			"gallery": gallery[]{
				"imageUrl": asset->url
			}
		}`;
	try {
		const projects = await client.fetch(query, { slug });
		// console.log('Fetched projects:', projects);
		return projects;
	} catch (err) {
		console.error('Error fetching recipes:', err);
		return [];
	}
};
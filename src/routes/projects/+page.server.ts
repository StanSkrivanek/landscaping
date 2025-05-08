import type { PageServerLoad } from './$types';
import {getAllProjects, getHero} from '$lib/server/sanityClient';

export const load = (async () => {
	const projects = await getAllProjects();
	const hero = await getHero('projects');

	return {
		isLoading: false,
		projects,
		hero
	};
}) satisfies PageServerLoad;

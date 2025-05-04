import type { PageServerLoad } from './$types';
import { getProjectBySlug } from '$lib/server/sanityClient';

export const load = (async ({params}) => {
    const project = await getProjectBySlug(params.slug);
    return {
        isLoading: false,
        project,

    };
}) satisfies PageServerLoad;
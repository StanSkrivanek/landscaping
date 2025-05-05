import type { PageServerLoad } from './$types';
import { getProjectBySlug, getAllProjectsSlugs } from '$lib/server/sanityClient';

export const load = (async ({ params }) => {
	const project = await getProjectBySlug(params.slug);
	const slugs = await getAllProjectsSlugs();
	const slugsArr = slugs.map((slug: { slug: unknown }) => slug.slug);
	const { prev, next } = prevnext({ project, slugsArr });

	return {
		isLoading: false,
		project,
		slugs,
		prev,
		next
	};
}) satisfies PageServerLoad;

interface Project {
	slug: string;
}

function prevnext({ project, slugsArr }: { project: Project; slugsArr: string[] }) {
    const index = slugsArr.findIndex((slug: string) => slug === project.slug);
    let prevIndex = index - 1;
    let nextIndex = index + 1;

    if (prevIndex < 0) {
        prevIndex = slugsArr.length - 1;
    }

    if (nextIndex >= slugsArr.length) {
        nextIndex = 0;
    }

    const prev = slugsArr[prevIndex];
    const next = slugsArr[nextIndex];

    return {
        prev,
        next
    };
}

import { getService, getHero } from '$lib/server/sanityClient';

export async function load({ params }) {
    const services = await getService(params.slug);
    const hero = await getHero(params.slug);

    return {
        isLoading: false,
        services,
        hero
    };
}
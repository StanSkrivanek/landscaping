import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// These details are safe to be public for image URL construction.
// You can also use public environment variables if preferred.
const projectId = 'lbo1agd3';
const dataset = 'production';

const builder = imageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => builder.image(source);

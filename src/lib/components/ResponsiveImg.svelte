<script lang="ts">
	import { urlFor } from '$lib/utils/sanityImageUrl';

	interface ResponsiveImgAttributes {
		image: string;
		alt: string;
		sizes?: string;
		className?: string;
		loading?: 'eager' | 'lazy';
		fetchpriority?: 'auto' | 'high' | 'low' | null | undefined;
	}

	let props = $props();

	const image = $derived(props.image);
	const className = props.className
	const loading = props.loading ?? 'lazy';
	const fetchpriority = props.fetchpriority ?? 'auto';
	const alt = props.alt ?? '';
	const sizes = $derived(
		props.sizes ??
			'(max-width: 600px) 400px, (max-width: 1024px) 800px, (max-width: 1680px) 1440px, 2400px'
	);

	const imageBuilder = (img: string, width: number) =>
		urlFor(img).width(width).auto('format').quality(75).url();

	const src480 = $derived(imageBuilder(image, 480));
	const src768 = $derived(imageBuilder(image, 768));
	const src1024 = $derived(imageBuilder(image, 1024));
	const src1366 = $derived(imageBuilder(image, 1366));
	const src1600 = $derived(imageBuilder(image, 1600));
	const src1920 = $derived(imageBuilder(image, 1920));
	const src2400 = $derived(imageBuilder(image, 2400));
	const src3840 = $derived(imageBuilder(image, 3840));

	const fallback = $derived(src1024);
</script>

<img
	srcset="
		{src480} 480w,
		{src768} 768w,
		{src1024} 1024w,
		{src1366} 1366w,
		{src1600} 1600w,
		{src1920} 1920w,
		{src2400} 2400w,
		{src3840} 3840w
	"
	{sizes}
	src={fallback}
	{alt}
	class={className}
	{loading}
	{fetchpriority}
/>

<style>
	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	:global(img.background-image) {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		z-index: -1;
	}
</style>

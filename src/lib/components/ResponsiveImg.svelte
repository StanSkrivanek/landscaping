<script lang="ts">
	import { urlFor } from '$lib/utils/sanityImageUrl';

	interface ResponsiveImgAttributes {
		image: string; // URL or image object
		alt: string; // Alt text for the image
		sizes?: string; // Sizes attribute for responsive images
		className?: string; // Optional class for styling
		loading?: 'eager' | 'lazy'; // Loading attribute for image (lazy |eager)
		fetchpriority?: 'auto' | 'high' | 'low' | null | undefined; // Fetch priority for the image
	}

	const {
		image,
		className,
		loading = 'lazy',
		fetchpriority = 'auto',
		alt = '',
		sizes = '(max-width: 600px) 400px, (max-width: 1024px) 800px, (max-width: 1680px) 1440px, 2400px'
	}: ResponsiveImgAttributes = $props();

	const imageBuilder = (width: number) =>
		urlFor(image).width(width).auto('format').quality(75).url();

	const src480 = imageBuilder(480);
	const src768 = imageBuilder(768);
	const src1024 = imageBuilder(1024);
	const src1366 = imageBuilder(1366); // Common laptop width
	const src1600 = imageBuilder(1600); // Larger laptop / smaller desktop
	const src1920 = imageBuilder(1920); // Full HD
	const src2400 = imageBuilder(2400); // Matches previous max, good for large displays
	const src3840 = imageBuilder(3840); // 4K displays

	const fallback = src1024; // Updated fallback to a common medium size
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

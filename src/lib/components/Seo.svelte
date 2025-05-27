<script lang="ts">
	import { page } from '$app/state'; // Using your existing import for page store
	let { title, description, siteName = 'ABR Landscaping' } = $props();

	// Reactive derived values for URLs and names
	 ;
	const currentUrl = $derived(page.url.href);
	let heroImg = $derived(page.data?.hero?.mainImage || '/img/abr-landscaping-hero.webp'); // Fallback to default if not provided
	const organizationLogoUrl = $derived(`${page.url.origin}/abr-favicon.png`); // Assuming abr-favicon.png is in static

	// Ensures heroImg is an absolute URL for SEO tags
	const absoluteHeroImg = $derived(() => {
		const img = heroImg; // Access signal value
		if (!img) {
			// Fallback if heroImg is empty, using a generic site image or logo
			return organizationLogoUrl;
		}
		if (img.startsWith('http')) {
			return img;
		}
		// Prepend origin and ensure correct path joining
		return `${page.url.origin}${img.startsWith('/') ? '' : '/'}${img}`;
	});

	// JSON-LD structured data object
	const jsonLdData = $derived({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: `ABR Landscaping | ${title || 'Home'}`,
		description: `ABR Landscaping | ${description || 'ABR Landscaping | Landscaping services in Cork county that nurture heart, soul, and mind.'}`,
		url: currentUrl,
		image: absoluteHeroImg,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': currentUrl
		},
		publisher: {
			'@type': 'Organization',
			name: siteName,
			url: page.url.origin, // Base URL of the website
			logo: {
				'@type': 'ImageObject',
				url: organizationLogoUrl
			}
		}
	});
</script>

<svelte:head>
	<title>{title} | ABR Landscaping</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={absoluteHeroImg()} />
	<meta property="og:url" content={currentUrl} />
	<link rel="canonical" href={currentUrl} />

	{#if jsonLdData}
		{@html `<script type="application/ld+json">
            ${JSON.stringify(jsonLdData)}
        </script>`}
	{/if}
</svelte:head>

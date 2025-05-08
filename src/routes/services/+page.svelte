<script>
	import CtaBlock from '$lib/components/CtaBlock.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import TilesGrid from '$lib/components/TilesGrid.svelte';
	const { data } = $props();
	// console.log('🚀 ~ data SERVICES:', data);
	const heroImg = data.hero.mainImage;
	const headline = data.hero.headline;
	const portableText = data.hero.introduction; // Optional chaining to avoid errors if content is undefined
	const items = data.services;
	// SEO data
	const title = data.hero.page;
	const description = data.hero.headline;
</script>

<Seo {title} {description} />
<Hero {heroImg} {headline} {portableText} />

<main>
	<TilesGrid {items} rootPath="/services" />
	<CtaBlock />
</main>
<Footer />

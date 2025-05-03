<script>
	import Hero from '$lib/components/Hero.svelte';
	import { PortableText } from '@portabletext/svelte';
	const { data } = $props();
	// console.log("🚀 ~ data:", data)

	const heroImg = data.hero.mainImage;
	const headline = data.hero.headline;
	const portableText = data.hero.introduction; // Optional chaining to avoid errors if content is undefined
	const items = data.services;
	import TilesGrid from '$lib/components/TilesGrid.svelte';
	import CtaBlock from '$lib/components/CtaBlock.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<Hero {heroImg} {headline} {portableText} />

<main>
	<TilesGrid {items} />
	<CtaBlock />
</main>
<Footer />
<script>
	import Hero from '$lib/components/Hero.svelte';
	import { PortableText } from '@portabletext/svelte';
	const { data } = $props();
	// console.log("🚀 ~ data:", data)

	const heroImg = data.hero.mainImage;
	const slogan = data.hero.slogan;
	const portableText = data.hero.introduction; // Optional chaining to avoid errors if content is undefined
	const items = data.services;
	import TilesGrid from '$lib/components/TilesGrid.svelte';
</script>

<Hero {heroImg} {slogan} {portableText} />

<main>
	<TilesGrid {items} />
</main>

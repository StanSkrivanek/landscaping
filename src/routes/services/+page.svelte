<script>
	import Hero from '$lib/components/Hero.svelte';
	import TilesGrid from '$lib/components/TilesGrid.svelte';
	const { data } = $props();
	$inspect('data', data); // Added logging for debugging purposes
	// let loading = data.isLoading;
	const heroImg = data.hero.mainImage;
	const slogan = data.hero.slogan;
	const content = data.hero?.introduction; // Optional chaining to avoid errors if content is undefined
	const items = data.services;
</script>

<Hero {heroImg} {slogan} {content} />

<main>
	<TilesGrid {items} />
</main>

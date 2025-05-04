<script>
	import CtaBlock from '$lib/components/CtaBlock.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import Hero from '$lib/components/Hero.svelte';

	const { data } = $props();
	console.log('🚀 ~ SLUG data:', data);

	const heroImg = data.service.mainImage;
	const headline = data.service.headline;
	const portableText = data.service.description; // Optional chaining to avoid errors if content is undefined
	// const items = data.service;
</script>

<Hero {heroImg} {headline} {portableText} />

<main>
	<div class="galery">
		{#if data.service.gallery}
			<Gallery items={data.service.gallery} />
		{/if}
	</div>
	<CtaBlock />
</main>
<Footer />

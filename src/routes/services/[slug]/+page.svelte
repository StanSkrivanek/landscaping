<script>
	import CtaBlock from '$lib/components/CtaBlock.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Seo from '$lib/components/Seo.svelte';

	const { data } = $props();
	console.log('🚀 ~ SLUG data:', data);

	const heroImg = $derived(data.service.mainImage);
	const headline = $derived(data.service.headline);
	const portableText = $derived(data.service.description); // Optional chaining to avoid errors if content is undefined
	const item = $derived(data.service);
	const shorts = $derived(data.service.shortDescription);
	function getShortsList() {
		if (!shorts || shorts.length === 0) {
			return 'No short description available';
		} else {
			return shorts
				.map((/** @type {{ shortList: string; }} */ short) => short.shortList)
				.join(', ');
		}
	}
	const shortDescription = getShortsList();
	console.log('🚀 ~ shortDescription:', shortDescription);
	// SEO data
	const title = $derived(item.title);
	const description = $derived(item.headline);
</script>

<Seo
	{title}
	description={`${description}. Our range of ${title} services include ${getShortsList()}`}
/>
<Hero {heroImg} {headline} {portableText} />

<main>
	{#if data.service.gallery}
		<Gallery items={data.service.gallery} />
	{/if}
	<section>
		<div class="all-services">
			{#each data.allServices as service}
				<div class="service-item">
					<a href="/services/{service.slug}"><p>{service.title}</p></a>
				</div>
			{/each}
		</div>
	</section>
	<CtaBlock />
</main>
<Footer />

<style>
	.all-services {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(135px, 1fr));
		gap: 8px;
		margin-top: -2rem;
	}
	.service-item {
		grid-column: span 2;
		padding: 1rem;
		text-align: center;
		border-radius: 8px;
		cursor: pointer;
		transition: background-color 0.3s;
		background-color: #f0f0f0; /* Add a default background color */
		&:hover {
			background-color: #e0e0e0; /* Change background color on hover */
		}
		& p {
			white-space: nowrap;
			font-size: var(--fs-sm);
		}
	}
</style>

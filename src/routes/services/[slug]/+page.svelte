<script>
	import CtaBlock from '$lib/components/CtaBlock.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Seo from '$lib/components/Seo.svelte';

	const { data } = $props();
	console.log('🚀 ~ data:', data);

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
				.join(', ')
				.toLowerCase();
		}
	}
	const shortDescription = getShortsList();
	// SEO data
	const title = $derived(item.title);
	const description = $derived(item.headline);
</script>

<Seo
	{title}
	description={`${description}. Our range of ${title} services include ${shortDescription}`}
/>
<Hero {heroImg} {headline} {portableText} />

<main>
	{#if data.service.gallery}
		<Gallery items={data.service.gallery} />
	{/if}
	<section>
		<div class="heading-block">
			<h2>SERVICES</h2>
		</div>
		<div class="all-services">
			{#each data.allServices as service}
				<div class="service-item">
					<a href="/services/{service.slug}"
						><p>{service.title}</p>
						<img src={service.thumb} alt="" />
					</a>
				</div>
			{/each}
		</div>
	</section>
	<CtaBlock />
</main>
<Footer />

<style>
	section {
		.heading-block {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 2rem;
		}
		.heading-block h2 {
			font-size: var(--fs-xxxxl);
			color: var(--clr-accent-dark);
			/* text-align: center; */
			text-transform: uppercase;
			font-family: var(--ff-org);
			font-style: italic;
			position: relative;
		}
		.heading-block h2:before {
			content: 'Our';
			position: absolute;
			top: -1rem;
			left: 0%;
			width: 100%;
			pointer-events: none;
			color: var(--clr-orange);
			font-size: var(--fs-xl);
			font-family: var(--ff-thin);
			font-style: italic;
			z-index: -1;
		}

	}

	.all-services {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(135px, 1fr));
		gap: 8px;
		/* margin-top: -2rem; */
	}
	.service-item {
		position: relative;
		grid-column: span 2;
		/* padding: 1rem; */
		text-align: center;
		border-radius: 8px;
		cursor: pointer;
		
		&:hover p{
			background-color: var(--clr-accent-dark);
		}
		& p {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			padding: 0.5rem 1rem;
			border-radius: 0.25rem;
			font-size: var(--fs-xxs);
			font-family: var(--ff-org);
			text-transform: uppercase;
			color: #fff;
			background-color: var(--clr-accent-dark-05);
			white-space: nowrap;
			transition: background-color 0.3s;
		}
		& img {
			width: 100%;
			height: 100%;
			border-radius: 0.25rem;
			/* cover */
			object-fit: cover;
			object-position: center;
			/* Add a transition effect */
		}
	}
</style>

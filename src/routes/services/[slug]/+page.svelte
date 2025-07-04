<script lang="ts">
	import CtaBlock from '$lib/components/CtaBlock.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Seo from '$lib/components/Seo.svelte';

	const { data } = $props();

	// Destructure properties from data.service
	const {
		mainImage: heroImg,
		headline,
		description: portableText,
		shortDescription: shorts,
		title
	} = $derived(data.service);

	// Only use $derived for computed values
	const shortDescription = $derived(
		!shorts || shorts.length === 0
			? 'No short description available'
			: shorts
					.map((short: { shortList: string }) => short.shortList)
					.join(', ')
					.toLowerCase()
	);
</script>

<!-- META for SEO -->
<Seo
	{title}
	description={`${headline}. Our range of ${title} services include ${shortDescription}`}
	siteName="ABR Landscaping"
/>
<!-- HERO SECTION -->
<Hero {heroImg} {headline} {portableText} />

<!-- CONTENT -->
<main>
	{#if data.service.gallery}
		<Gallery items={data.service.gallery} />
	{/if}
	<section>
		<div class="heading-block">
			<h2><span>Our</span>Services</h2>
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
<!-- FOOTER -->
<Footer />

<style>
	section {
		/* display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem; */
		& .heading-block {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 2rem;
		}
		& .heading-block h2 {
			position: relative;
			font-size: var(--fs-xxxxl);
			color: var(--clr-accent);
			/* text-transform: uppercase; */
			font-family: var(--ff-org);
			/* font-style: italic; */
			& span {
				position: absolute;
				top: calc(-28% - 1rem);
				left: 0;
				width: 100%;
				pointer-events: none;
				color: var(--clr-orange);
				font-family: var(--ff-light);
				font-size: var(--fs-xxl);
				font-style: italic;
				z-index: -1;
			}
		}

		/* & h2 {
			position: relative;
			grid-column: 1 / -1;
			font-size: var(--fs-xxxxl);
			margin-bottom: 1rem;
			& span {
				position: absolute;
				top: calc(-28% - 1rem);
				left: 0;
				width: 100%;
				pointer-events: none;
				color: var(--clr-orange);
				font-size: var(--fs-xxl);
				font-style: italic;
				z-index: -1;
			}
		}
	} */
	}

	.all-services {
		/* grid-column: 8 / -2; */
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

		&:hover p {
			background-color: var(--clr-orange);
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

<script>
	import Cta from '$lib/components/CtaBlock.svelte';
	import Faq from '$lib/components/Faq.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import GlobIntro from '$lib/components/GlobIntro.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import ImgCarousel from '$lib/components/ImgCarousel.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import TilesGrid from '$lib/components/TilesGrid.svelte';

	const { data } = $props();
	console.log("🚀 ~ data:", data)

	// Extracting data from the props
	const heroImg = data.hero.mainImage;
	const headline = data.hero.headline;
	const portableText = data.hero?.introduction;
	const items = data.services;
</script>

<Seo
	title="Home"
	description="Landscaping services in Cork county that nurture heart, soul, and mind."
/>
<Hero {heroImg} {headline} {portableText} />

<main>
	<GlobIntro />
	<TilesGrid {items} rootPath="/services" />
	<section class="section-grid">
		<div class="text-block">
			<p><span>People says </span> we craft spaces that nurture heart, soul, and mind</p>
		</div>
	</section>
	<ImgCarousel  />
	<Faq />
	<Cta />
</main>

<Footer />

<style>
	.text-block {
		display: flex;
		margin-block: 5rem;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		grid-column: 1/-1;
		/* font-size: var(--fs-xxl); */

		& p {
			font-family: var(--ff-org);
			line-height: 1;
			max-width: 20ch;
			font-size: var(--fs-xxxxl);
			& span {
				color: var(--clr-accent);
			}
		}
	}
</style>

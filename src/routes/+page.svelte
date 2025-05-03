<script>
	import Cta from '$lib/components/CtaBlock.svelte';
	import Faq from '$lib/components/Faq.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import GlobIntro from '$lib/components/GlobIntro.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import ImgCarousel from '$lib/components/ImgCarousel.svelte';
	import TilesGrid from '$lib/components/TilesGrid.svelte';

	const { data } = $props();
	// $inspect('data', data); // Added logging for debugging purposes
	// let loading = data.isLoading;
	const heroImg = data.hero.mainImage;
	const slogan = data.hero.slogan;
	const introduction = data.hero?.introduction;
	const items = data.services;
</script>

<Hero {heroImg} {slogan} {introduction} />
<!-- <section> -->
<main>
	<GlobIntro />
	<TilesGrid {items} />
	<section class="section-grid">
		<div class="text-block">
			<p><span>People says </span> we craft spaces that nurture heart, soul, and mind</p>
			<!-- <p>WE CREATE <span>SPACES THAT WILL NURTURE YOUR HEART</span>, SOUL AND MIND</p> -->
		</div>
	</section>
	<ImgCarousel />
	<Faq />
	<Cta />
</main>
<!-- </section> -->
<Footer />

<!-- STYLE -->
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

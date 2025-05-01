<script>
	import Cta from '$lib/components/CtaBlock.svelte';
	import Faq from '$lib/components/Faq.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import GlobIntro from '$lib/components/GlobIntro.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import ImgCarousel from '$lib/components/ImgCarousel.svelte';
	import TilesGrid from '$lib/components/TilesGrid.svelte';

	const { data } = $props();
	$inspect('data', data); // Added logging for debugging purposes
	// let loading = data.isLoading;
	const items = data.services;
</script>

<Hero />
<!-- <section> -->
<GlobIntro />
<TilesGrid {items} />
<section class="section-grid">
	<div class="text-center">
		<p>WE CREATE <span>SPACES THAT WILL NURTURE YOUR HEART</span>, SOUL AND MIND</p>
	</div>
</section>
<ImgCarousel />
<Faq />
<Cta />
<!-- </section> -->
<Footer />

<!-- STYLE -->
<style>
	.text-center {
		display: flex;
		margin-block: 5rem;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		grid-column: 1/-1;
		font-size: var(--fs-xxl);

		& p {
			font-family: var(--ff-org);
			line-height: 1;
			max-width: 720px;
			font-size: var(--fs-xxl);
			& span {
				color: var(--clr-accent);
			}
		}
	}
</style>

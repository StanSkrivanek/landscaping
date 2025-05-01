<script>

	import Cta from '$lib/components/CtaBlock.svelte';
	import Faq from '$lib/components/Faq.svelte';
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
<section>
	<GlobIntro />
	<TilesGrid {items} />
	<div class="text-center">
		<p>WE CREATE <span>SPACES THAT WILL NURTURE YOUR HEART</span>, SOUL AND MIND</p>
	</div>
	<ImgCarousel />
	<Faq />
	<Cta />
</section>

<style>
	section {
		padding-inline: 0.6rem;
	}
	.text-center {
		display: flex;
		margin-block: 12rem;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 1rem;


		font-size: var(--fs-xxl);
		/* background-color: chocolate; */
		& p{
			font-family: var(--ff-org);
			line-height: 1;
			max-width: 720px;
			font-size: var(--fs-xxl);
			& span{
				color: var(--clr-accent);
			}
			
		}

	}
</style>

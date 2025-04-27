<script>
	import Cta from '$lib/components/CtaBlock.svelte';
	import GlobIntro from '$lib/components/GlobIntro.svelte';
	import Hero from '$lib/components/Hero.svelte';
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
	<Cta />
</section>

<style>
	section {
		padding-inline: .6rem;
	}

</style>

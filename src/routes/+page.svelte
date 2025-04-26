<script>
	import Cta from '$lib/components/CtaBlock.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import TilesGrid from '$lib/components/TilesGrid.svelte';

	const { data } = $props();
	$inspect('data', data); // Added logging for debugging purposes
	// let loading = data.isLoading;
	const items = data.services;
</script>

<Hero />
<section>
	<TilesGrid {items} />
	<Cta />
</section>

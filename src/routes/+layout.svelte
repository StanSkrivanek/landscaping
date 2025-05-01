<script>
	import { page } from '$app/state';
	import Navigation from '$lib/components/Navigation.svelte';
	import '../app.css';
	let { children } = $props();
</script>

<!-- render layout -->
<div class="page__c">

		<!-- <div class="container"> -->
			{#if !page.url.pathname.startsWith('/studio')}
				<Navigation />
			{/if}
			{@render children?.()}
		<!-- </div> -->
	
</div>

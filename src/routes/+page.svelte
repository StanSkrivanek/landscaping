<script>
	import Cta from '$lib/components/CtaBlock.svelte';
	import Hero from '$lib/components/Hero.svelte';
</script>

<Hero />
<section>
	<Cta />
</section>

<style>
	/* .hero {
		position: relative;
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		grid-column: 1 / -1;
		height: 900px;
		gap: 16px;
        background: url('https://cdn.sanity.io/images/lbo1agd3/production/1816dd630f6ef5c83067daeffa1c65915ec7901a-1440x800.webp') center/cover no-repeat;
		overflow: hidden;
	
		container-type: inline-size;
        pointer-events: none;
	} */

	/* .hero-content {
		flex: 1;
		position: relative;
		z-index: 1;
		grid-column: 2 / span 4;
		align-self: self-end;
		margin-bottom: 4rem;/

		& h1 {
			color: var(--clr-text-light);
			font-size: var(--ff-xxxl);
		}
	} */

	/* container query */
	/* @container (max-width: 1970px) {
		.hero-content {
			& h1 {
				font-size: var(--ff-xxxl);
			}
		}
	} */

	/* @container (max-width: 992px) {
		.hero {
			grid-template-columns: repeat(8, 1fr);
		}
		.hero-content {
			& h1 {
				font-size: var(--ff-xxl);
			}
		}
	} */

	/* @container (max-width: 768px) {
		.hero {
			height: 600px;
		}
		.hero-content {
			margin-bottom: 2.5rem;
			& h1 {
				font-size: var(--ff-xl);
			}
		}
	} */

	/* @container (max-width: 480px) {
		.hero {
			height: 400px;
		}
		.hero-content {
			grid-column: 2 / -2;
			margin-bottom: 2rem;
			& h1 {
				font-size: var(--ff-lg);
			}
		}
	} */
</style>

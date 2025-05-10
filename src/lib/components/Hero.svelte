<script>
	import CustomHeading from '$lib/components/portableText/CustomHeading.svelte';
	import CustomParagraph from '$lib/components/portableText/CustomParagraph.svelte';
	import { PortableText } from '@portabletext/svelte';
	import ResponsiveImg from './ResponsiveImg.svelte';
	const { heroImg, headline, portableText } = $props();
</script>

<div class="hero" >
	{#if heroImg}
		<ResponsiveImg
			image={heroImg}
			alt="Hero background"
			className="background-image"
			loading="eager"
			fetchpriority="high"
		/>
	{/if}

	<div class="hero-headline">
		<h1>{headline}</h1>
	</div>
</div>
{#if portableText}
	<section class="section-grid">
		<article class="hero-content">
			<PortableText
				value={portableText}
				onMissingComponent={false}
				components={{
					block: {
						h1: CustomHeading,
						h2: CustomHeading,
						h3: CustomHeading,
						normal: CustomParagraph
					},
					types: {
						block: CustomParagraph
					}
				}}
			/>
		</article>
	</section>
{/if}

<!-- {#if introduction} -->

<style>
	.hero {
		position: relative;
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		grid-column: 1 / -1;
		height: 86dvh;
		gap: 16px;
		overflow: hidden;
		pointer-events: none;
		
	}
	
:global(.background-image) {
		position:absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		z-index: -1;
	}
	.hero-headline {
		flex: 1;
		position: relative;
		z-index: 1;
		grid-column: 2 / span 4;
		align-self: self-end;
		margin-bottom: 3rem;
		text-shadow: 6px 4px 4px rgba(0, 0, 0, 0.5);

		& h1 {
			color: var(--clr-text-light);
			font-size: var(--fs-xxxl);
		}
	}
	.hero-content {
		grid-column: 1 / -1;
		align-self: self-end;
		font-size: var(--fs-sm);
		margin: 0 auto;
		z-index: 1;
		pointer-events: auto;
		max-width: 72ch;
	}

	/* container query */
	@media (width < 1970px) {
		.hero {
			max-height: 100dvh;
		}
		.hero-headline {
			& h1 {
				font-size: var(--fs-xxxl);
			}
		}
	}

	@media (width < 992px) {
		.hero {
			grid-template-columns: repeat(8, 1fr);
			height: 700px;
		}
		.hero-headline {
			& h1 {
				font-size: var(--fs-xxl);
			}
		}
	}

	@media (width < 768px) {
		.hero {
			height: 600px;
		}
		.hero-headline {
			margin-bottom: 2.5rem;
			& h1 {
				font-size: var(--fs-xl);
			}
		}
	}

	@media (width < 480px) {
		.hero {
			height: 400px;
		}
		.hero-headline {
			grid-column: 2 / -2;
			margin-bottom: 2rem;
			& h1 {
				font-size: var(--fs-lg);
			}
		}
	}
</style>

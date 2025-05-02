<script>
	import CustomHeading from '$lib/portableText/CustomHeading.svelte';
	import CustomParagraph from '$lib/portableText/CustomParagraph.svelte';
	import { PortableText } from '@portabletext/svelte';
	const { heroImg, slogan, introduction } = $props();
	// $inspect('heroImg', heroImg); // Added logging for debugging purposes
	$inspect('introduction', introduction); // Added logging for debugging purposes
</script>

<div class="hero" style="--image-url: url({heroImg});">
	<div class="hero-headline">
		<h1>{slogan}</h1>
	</div>
</div>
{#if introduction}
	<div class="hero-content">
		<h1>TEXT</h1>
		<PortableText
			value={introduction}
			onMissingComponent={false}
			components={{
				block: {
					normal: CustomParagraph,
					h1: CustomHeading,
					h2: CustomHeading,
					h3: CustomHeading
				}
			}}
		/>
	</div>
{/if}

<style>
	.hero {
		position: relative;
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		grid-column: 1 / -1;
		height: 86dvh;
		gap: 16px;
		background-image: var(--image-url);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		overflow: hidden;
		pointer-events: none;
	}

	.hero-headline {
		flex: 1;
		position: relative;
		z-index: 1;
		grid-column: 2 / span 4;
		align-self: self-end;
		margin-bottom: 3rem;
		/* background-color: black; */

		& h1 {
			color: var(--clr-text-light);
			font-size: var(--fs-xxxl);
		}
	}
	.hero-content {
		grid-column: 2 / span 4;
		align-self: self-end;
		margin-bottom: 3rem;
		z-index: 1;
		pointer-events: auto;
	}
	.hero-content p {
		color: var(--clr-text-light);
		font-size: var(--fs-lg);
		line-height: 1.5;
		max-width: 40ch;
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

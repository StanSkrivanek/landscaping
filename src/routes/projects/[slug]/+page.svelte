<script lang="ts">
	import CtaBlock from '$lib/components/CtaBlock.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ResponsiveImg from '$lib/components/ResponsiveImg.svelte';
	import Seo from '$lib/components/Seo.svelte';

	const { data } = $props();

	const { mainImage, location, title, overview, premiseType, img1, img2, img3, img4 } = $derived(
		data.project
	);
</script>

<!-- SEO -->
<Seo {title} description={`${title} in ${location}`} siteName="ABR Landscaping" />

<!-- Hero Section -->
<div class="hero">
	{#if mainImage}
		<ResponsiveImg
			image={mainImage}
			alt={`${title} hero background`}
			className="hero-background-image"
			loading="eager"
			fetchpriority="high"
		/>
	{/if}
</div>
<!-- Content -->
<main>
	<div class="grid">
		<div class="project-grid">
			<div class="project-data__c">
				<div class="data-title">
					<h1>{title}</h1>
				</div>
				<div class="data-overview">
					<div class="location">
						<h2>Location</h2>
						<p>{location}</p>
						<p>{premiseType.type}</p>
					</div>
					<h2>Overview</h2>
					<p>{overview}</p>
				</div>
				<div class="data-contact">
					<img src="/svg/abr-logo-txt-orange.svg" alt="ABR Landscaping logo" />
					<div>
						<p>
							<a href="mailto:example@example.com">info@abrlandscaping.com</a>
						</p>
						<p>
							<a href="tel:+123456789">+353 80 124 5678</a>
						</p>
					</div>
				</div>
			</div>
			<div class="project-img-1">
				<!-- <img src={data.project.img1} alt="Main view of project" /> -->
				<ResponsiveImg image={img1} alt="preview 1 of project" />
			</div>
			<div class="project-img-2">
				<ResponsiveImg image={img2} alt="preview 2 of project" />
			</div>
			<div class="project-img-3">
				<ResponsiveImg image={img3} alt="preview 3 of project" />
			</div>
			<div class="project-img-4">
				<ResponsiveImg image={img4} alt="preview 4 of project" />
			</div>
			<div class="prev-next">
				<a href="/projects/{data.prev}"><span class="prev">PREV</span></a>
				<a href="/projects/{data.next}"><span class="next">NEXT</span></a>
			</div>
		</div>
		<CtaBlock />
	</div>
</main>

<!-- Footer -->
<Footer />

<style>
	.project-grid {
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		/* Make row height responsive to viewport width */
		/* grid-auto-rows: minmax(min-content, calc(30vw)); */
		max-width: 100%;
		margin: 0 auto;
	}
	.project-data__c {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		grid-column: 1 / span 3;
		min-width: 480px;
		color: var(--clr-text-light);
		background-color: black;

		& h2 {
			color: var(--clr-text-light);
			font-size: var(--fs-lg);
			margin-bottom: 0.75rem;
		}
	}

	.data-title {
		flex: 1;
		position: absolute;
		bottom: 100%;
		width: 100%;
		padding: clamp(1rem, 3vw, 2rem);
		padding-top: 3.5rem;
		color: var(--clr-text-light);
		background-color: black;

		& h1 {
			color: var(--clr-text-light);
			letter-spacing: 0.05rem;

			font-size: var(--fs-xxl);
			margin-bottom: clamp(1rem, 3vw, 3rem);
			&:after {
				content: '';
				display: block;
				width: 100%;
				height: 2px;
				background-color: var(--clr-accent);
				margin-top: 1.5rem;
			}
		}
	}
	.data-overview {
		padding: clamp(1rem, 3vw, 2rem);
		& .location {
			margin-bottom: 2rem;
		}
	}
	.data-contact {
		padding: clamp(1rem, 3vw, 2rem);
		img {
			max-width: 240px;
			height: auto;
			margin-bottom: 1rem;
		}
		& a {
			color: var(--clr-text-light);
			font-size: var(--fs-sm);
		}
	}
	.project-img-1 {
		grid-column: 4 / -1;
	}
	.project-img-2 {
		grid-column: 1 / span 7;
	}
	.project-img-3 {
		grid-column: 8 / -1;
	}
	.project-img-4 {
		grid-column: 1/ -1;
	}

	.prev-next {
		grid-column: 1 / -1;
		display: flex;
		justify-content: space-between;
		height: max-content;
		/* background-color: black; */
		a {
			padding: 2rem 4rem;
			color: var(--clr-text-light);
			font-size: var(--fs-xxxxl);
			text-decoration: none;
			font-family: var(--ff-org);
			/* background-color: burlywood; */
			background-color: var(--clr-accent-dark);
			transition:
				background-color 0.3s ease-out,
				text-decoration 0.3s ease-out;
			/* border-bottom-left-radius: 0.5rem; */
			& span {
				display: inline-block; /* Add this line */
				transition: transform 0.3s ease-out; /* Optional: add transition for the skew */
				will-change: transform; /* Hint for browser optimization */
			}
			&:hover {
				background-color: var(--clr-orange);
				/* text-decoration: underline; */
				& span.prev {
					transform: skew(15deg);
				}
				& span.next {
					transform: skew(-15deg);
				}
			}
		}
	}
	/* Responsive layouts using modern CSS */
	@media (width < 1200px) {
		.project-grid {
			grid-template-columns: repeat(8, 1fr);
		}

		.project-data__c {
			grid-column: 1 / span 4;
		}

		.project-img-1 {
			grid-column: 5 / -1;
		}

		.project-img-2 {
			grid-column: 1 / span 5;
		}

		.project-img-3 {
			grid-column: 6 / -1;
		}
	}

	@media (width < 768px) {
		.project-grid {
			grid-template-columns: repeat(4, 1fr);
			/* Adjust row height for smaller screens */
			/* grid-auto-rows: minmax(min-content, calc(50vw)); */
			/* grid-auto-rows: minmax(min(400px, 40vh), auto); */
		}

		.project-data__c {
			grid-column: 1 / -1;
			position: relative;
		}

		/* .data-location {
			position: static;
		} */

		.project-img-1 {
			grid-column: 1 / -1;
		}

		.project-img-2 {
			grid-column: 1 / -1;
		}

		.project-img-3 {
			grid-column: 1 / -1;
		}
	}

	@media (width < 480px) {
		.hero {
			height: 50vh;
		}

		.project-grid {
			/* Further adjust row height for mobile */
			grid-auto-rows: minmax(min-content, calc(70vw));
			/* grid-auto-rows: minmax(min(300px, 40vh), auto); */
		}
		.project-data__c {
			min-width: 100%;
		}
		/* .data-location, */
		.data-overview,
		.data-contact {
			padding: 1rem;
		}

		.data-contact img {
			max-width: 180px;
		}
	}

	/* container query */
	@media (width < 1970px) {
		.hero {
			max-height: 100dvh;
		}
	}

	@media (width < 992px) {
		.hero {
			grid-template-columns: repeat(8, 1fr);
			height: 700px;
		}
	}

	@media (width < 768px) {
		.hero {
			height: 600px;
		}
	}

	@media (width < 480px) {
		.hero {
			height: 400px;
		}
	}
</style>

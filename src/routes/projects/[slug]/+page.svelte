<script>
	import CtaBlock from '$lib/components/CtaBlock.svelte';
	import Footer from '$lib/components/Footer.svelte';

	const { data } = $props();
	console.log('🚀 ~ data PROJECT:', data);
	const heroImg = data.project.mainImage;
</script>

<div class="hero" style="--image-url: url({heroImg});"></div>
<main>
	<div class="grid">
		<div class="project-grid">
			<div class="project-data__c">
				<div class="data-location">
					<h2>Location</h2>
					<p>{data.project.location}</p>
					<p>{data.project.premiseType.type}</p>
				</div>
				<div class="data-overview">
					<h2>Overview</h2>
					<p>{data.project.overview}</p>
				</div>
				<div class="data-contact">
					<img
						src="https://cdn.sanity.io/images/lbo1agd3/production/f734f6cb6c51a27b41bea4ab46a72997e3d31720-368x97.svg"
						alt=""
					/>
					<div>
						<p>
							<a href="mailto:example@example.com">info@abrlandscaping.com</a>
						</p>
						<p>
							<a href="tel:+123456789">+353 86 896 6575</a>
						</p>
					</div>
				</div>
			</div>
			<div class="project-img-1">
				<img src={data.project.img1} alt="Main view of project" />
			</div>
			<div class="project-img-2">
				<img src={data.project.img2} alt="Main view of project" />
			</div>
			<div class="project-img-3">
				<img src={data.project.img3} alt="Main view of project" />
			</div>
			<div class="project-img-4">
				<img src={data.project.img4} alt="Main view of project" />
			</div>
		</div>
		<CtaBlock />
	</div>
</main>
<Footer />

<style>
	.hero {
		position: relative;
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		grid-column: 1 / -1;
		height: 86dvh;
		/* gap: 16px; */
		background-image: var(--image-url);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		overflow: hidden;
		pointer-events: none;
	}

	.project-grid {
		display: grid;
		grid-template-columns: repeat(10, 1fr);
        grid-template-rows: repeat(2, minmax(600px, 800px));
		margin-bottom: 2rem;
        width: 100vw;
        /* max-width: 2400px; */
        margin: 0 auto;
	}
	.project-data__c {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		grid-column: 1 / span 3;
		
		color: var(--clr-text-light);
		background-color: black;

		& h2 {
			color: var(--clr-text-light);
			margin-bottom: 0.75rem;
		}
	}

	.data-location {
		flex: 1;
		position: absolute;
		bottom: 100%;
		width: 100%;
		/* z-index: 1; */
		padding: 2rem;
		color: var(--clr-text-light);
		background-color: black;

		& h2 {
			color: var(--clr-text-light);
			letter-spacing: 0.1rem;
			font-size: var(--fs-lg);
			margin-bottom: 0.75rem;
		}
		& p {
			color: var(--clr-text-light);
			font-size: var(--fs-xs);
		}
	}
	.data-overview {
		padding: 2rem;
	}
	.data-contact {
		padding: 2rem;
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
     
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }
    }
    .project-img-2 {
        grid-column: 1 / span 7;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }
    }
    .project-img-3 {
        grid-column: 8 / -1;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }
    }
    .project-img-4 {
        grid-column:  1/ -1;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
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
		/* .hero-headline {
			margin-bottom: 2.5rem;
			& h1 {
				font-size: var(--fs-xl);
			}
		} */
	}

	@media (width < 480px) {
		.hero {
			height: 400px;
		}
		/* .hero-headline {
			grid-column: 2 / -2;
			margin-bottom: 2rem;
			& h1 {
				font-size: var(--fs-lg);
			}
		} */
	}
</style>

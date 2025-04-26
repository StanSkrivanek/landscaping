<script>
	// load data from CMS
</script>

<div class="hero">
	<!-- <Navigation /> -->
	<div class="hero-content">
		<!-- <h1>{headline}</h1> -->
		<h1>Crafting outdoor spaces with beauty, purpose, and permanence</h1>
	</div>
</div>

<style>
	.hero {
		position: relative;
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		grid-column: 1 / -1;
		height: 960px;
		gap: 16px;
		background: url('https://cdn.sanity.io/images/lbo1agd3/production/1816dd630f6ef5c83067daeffa1c65915ec7901a-1440x800.webp')
			center/cover no-repeat;
		overflow: hidden;
		/* Enable container queries */
		container-type: inline-size;
		pointer-events: none;
	}

	.hero-content {
		flex: 1;
		position: relative;
		z-index: 1;
		grid-column: 2 / span 4;
		align-self: self-end;
		margin-bottom: 4rem;
		/* background-color: black; */

		& h1 {
			color: var(--clr-text-light);
			font-size: var(--ff-xxxl);
		}
	}

	/* container query */
	@media (width < 1970px) {
		.hero {
			max-height: 100dvh;
		}
		.hero-content {
			& h1 {
				font-size: var(--ff-xxxl);
			}
		}
	}

	@media (width < 992px) {
		.hero {
			grid-template-columns: repeat(8, 1fr);
			height: 700px;
		}
		.hero-content {
			& h1 {
				font-size: var(--ff-xxl);
			}
		}
	}

	@media (width < 768px) {
		.hero {
			height: 600px;
		}
		.hero-content {
			margin-bottom: 2.5rem;
			& h1 {
				font-size: var(--ff-xl);
			}
		}
	}

	@media (width < 480px) {
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
	}
</style>

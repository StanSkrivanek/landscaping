<script>
</script>

<div class="hero">
	<div class="hero-bg"></div>
	<div class="hero-content">
		<!-- <h1>Transforming Outdoor Spaces with Precision & Passion</h1> -->
         
        <h1>Crafting outdoor spaces with beauty, purpose, and permanence</h1>
	</div>
</div>

<style>
	.hero {
		position: relative;
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		grid-column: 1 / -1;
		height: 800px;
		gap: 16px;

		/* min-height: 100vh; */
		overflow: hidden;
		/* Enable container queries */
		container-type: inline-size;
	}

	.hero-bg {
		position: absolute;
		inset: 0;
		z-index: 0;
		background: url('https://i.postimg.cc/kX2jn2HS/Iceland.jpg') center/cover no-repeat;
		pointer-events: none;
	}

	.hero-content {
		flex: 1;
		position: relative;
		z-index: 1;
		grid-column: 2 / 6;
		align-self: self-end;
		margin-bottom: 4rem;
        background-color: black;

		& h1 {
			/* font-size: clamp(2rem, 4vw + .5rem, 4rem); */
			color: var(--clr-text-light);
            font-size: var(--ff-xxxl);
		}
	}

	/* media query */
@container (max-width: 1200px) {
        .hero {
            /* grid-template-columns: repeat(8, 1fr); */
        }
        .hero-content {
            grid-column: 2 / 7;
            & h1 {
                font-size: var(--ff-xxxl);
            }
        }
    }
    @container (max-width: 992px) {
        .hero {
            grid-template-columns: repeat(8, 1fr);
        }
        .hero-content {
            grid-column: 2 / 6;
            & h1 {
                font-size: var(--ff-xxl);
            }
        }
    }
	@container (max-width: 768px) {
		.hero {
			height: 600px;
		}
		.hero-content {
			grid-column: 2 / 7;
            margin-bottom: 2.5rem;
			& h1 {
				font-size: var(--ff-xl);
			}
		}
	}

	@container (max-width: 480px) {
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

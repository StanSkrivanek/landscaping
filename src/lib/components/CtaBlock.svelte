<script lang="ts">
</script>

<section class="section-grid">
	<div class="decoration">
		<img
			src="https://cdn.sanity.io/images/lbo1agd3/production/f7d40d83ec3f900c2d0b23a0cdab80cdddde34df-354x284.svg"
			alt=""
		/>
	</div>
	<div class="cta-content">
		<h2><span>Ready</span> to transform your outdoor space?</h2>
		<p>
			Let us bring your vision to life with custom landscaping solutions that enhance the beauty,
			functionality, and sustainability of your property!
		</p>
		<a href="/" class="cta-button">Let's get in touch</a>
	</div>
</section>

<style>
	
	.decoration {
		display: flex;
		grid-column: 2 / span 4;
		align-items: center;
		justify-content: center;
		width: 75%;
		margin: 0 auto;
	}
	.cta-content {
		grid-column: 6 / span 4;
	}
	.cta-content h2 {
		font-family: var(--ff-regular);
		font-size: var(--fs-xxxxl);
		margin-bottom: 1rem;
		& span {
			color: var(--clr-accent);
		}
	}
	.cta-content p {
		font-size: var(--fs-md);
		margin-bottom: 6rem;
	}
	.cta-button {
		background-color: var(--clr-accent-dark);
		color: var(--clr-text-light);
		border: none;
		padding: 1rem 2rem;
		font-size: var(--fs-md);
		text-transform: uppercase;
		cursor: pointer;
		border-radius: 0.25rem;
		transition: background-color 0.3s ease;
	}
	.cta-button:hover {
		/* background-color: var(--clr-text-dark); */
		background-color: var(--clr-orange);
	}

	@container (max-width: 992px) {
		.section-grid {
			/* grid-template-columns: repeat(8, 1fr); */
			padding-block: 4rem;
		}
		.decoration {
			grid-column: 4 / span 4;
			width: 100%;
			margin-bottom: 2rem;
		}
		.cta-content {
			grid-column: 3 / span 6;
			text-align: center;
		}
		.cta-content h2 {
			font-size: var(--fs-xxxxl);
		}
		.cta-content p {
			font-size: var(--fs-md);
		}
		.cta-button {
			font-size: var(--fs-md);
		}
	}
	@container (max-width: 768px) {
		.section-grid {
			padding-block: 4rem;
		}
		.decoration {
			grid-column: 3 / span 6;
			width: 100%;
			margin-bottom: 2rem;
		}
		.cta-content {
			grid-column: 2 / -2;
			text-align: center;
			& p {
                font-size: var(--fs-md);
                margin-bottom: 4rem;
			}
		}
	}
	@container (max-width: 480px) {
		.section-grid {
			padding-block: 3rem;
		}
		.decoration {
			grid-column: 2 / -2;
			width: 100%;
			margin-bottom: 2rem;
		}
		.cta-content {
			grid-column: 2 / -2;
			text-align: center;
		}
		.cta-content p {
			font-size: var(--fs-xxs);
		}
		.cta-button {
			font-size: var(--fs-xxs);
			width: 100%;
		}
	}
	@container (max-width: 320px) {
		.section-grid {
			padding-block: 1rem;
		}
		.decoration {
			grid-column: 2 / -2;
			width: 100%;
			margin-bottom: 2rem;
		}
		.cta-content {
			grid-column: 1 / -1;
			text-align: center;
		}
		.cta-content p {
			font-size: var(--fs-xs);
		}
		.cta-button {
			font-size: var(--fs-xs);
			width: 100%;
		}
	}
</style>

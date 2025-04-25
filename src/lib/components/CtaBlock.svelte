<script lang="ts">
</script>

<div class="cta-container">
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
</div>

<style>
	.cta-container {
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		gap: 16px;
		grid-column: 1 / -1;
		/* padding: 2rem; */
		background-color: var(--clr-primary);
		color: var(--clr-text);
		padding-block: 10rem;
		/* Enable container queries */
		container-type: inline-size;
	}
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
		font-size: var(--ff-xxxxl);
		margin-bottom: 1rem;
		& span {
			color: var(--clr-accent);
		}
	}
	.cta-content p {
		font-size: var(--ff-md);
		margin-bottom: 6rem;
	}
	.cta-button {
		background-color: var(--clr-accent-dark);
		color: var(--clr-text-light);
		border: none;
		padding: 1rem 2rem;
		font-size: var(--ff-md);
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
		.cta-container {
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
			font-size: var(--ff-xxxl);
		}
		.cta-content p {
			font-size: var(--ff-lg);
		}
		.cta-button {
			font-size: var(--ff-lg);
		}
	}
	@container (max-width: 768px) {
		.cta-container {
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
                font-size: var(--ff-md);
                margin-bottom: 4rem;
			}
		}
	}
	@container (max-width: 480px) {
		.cta-container {
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
			font-size: var(--ff-sm);
		}
	}
	@container (max-width: 320px) {
		.cta-container {
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
			font-size: var(--ff-xs);
		}
		.cta-button {
			font-size: var(--ff-xs);
			width: 100%;
		}
	}
</style>

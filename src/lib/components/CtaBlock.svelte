<script lang="ts">
</script>

<div class="cta-container">
	<div class="decoration">
		<img
			src="https://cdn.sanity.io/images/lbo1agd3/production/f7d40d83ec3f900c2d0b23a0cdab80cdddde34df-354x284.svg"
			alt=""
			srcset=""
		/>
	</div>
	<div class="cta-content">
		<h2><span>Ready</span> to transform your outdoor space?</h2>
		<p>
			Let us bring your vision to life with custom landscaping solutions that enhance the beauty,
			functionality, and sustainability of your property!
		</p>
		<a href="#" class="cta-button">Let's get in touch</a>
	</div>
</div>

<style>
	.cta-container {
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		gap: 16px;
		grid-column: 1 / -1;
		padding: 2rem;
		background-color: var(--clr-primary);
		color: var(--clr-text);
		padding-block: 10rem;
	}
	.decoration {
		display: flex;
		grid-column: 2 / span 3;
		align-items: center;
		width: 90%;
		/* width: 100%;
        height: 100%; */
		/* z-index: -1; */
		/* opacity: 0.5; */
	}
	.cta-content {
		/* max-width: 600px; */
		grid-column: 5 / span 4;
	}
	.cta-content h2 {
        font-family: var(--ff-regular);
		font-size: var(--ff-xxxl);
		margin-bottom: 1rem;
		& span {
			color: var(--clr-accent);
		}
	}
	.cta-content p {
		font-size: var(--ff-md);
		margin-bottom: 2rem;
	}
	.cta-button {
		background-color: var(--clr-accent);
		color: var(--clr-text-light);
		border: none;
		padding: 1rem 2rem;
		font-size: var(--ff-lg);
		cursor: pointer;
		transition: background-color 0.3s ease;
	}
    .cta-button:hover {
        background-color: var(--clr-accent-dark);
    }
</style>

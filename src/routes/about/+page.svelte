<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Seo from '$lib/components/Seo.svelte';

	// magic
</script>

<Seo
	title="About Us"
	description="Landscaping services in Cork county that nurture heart, soul, and mind."
/>
<main>
	<section>
		<h1>About Us</h1>
		<div class="section-grid">
            <div class="about-info">
                <p>
                    We are a dedicated team of landscaping professionals committed to transforming outdoor
                    spaces into beautiful, functional, and sustainable environments. Our passion for nature and
                    design drives us to create landscapes that nurture the heart, soul, and mind.
                </p>
                <p>
                    With years of experience in the industry, we pride ourselves on our attention to detail,
                    creativity, and commitment to customer satisfaction. Whether it's a small garden or a large
                    commercial project, we approach every job with the same level of care and dedication.
                </p>
                <p>
                    Our mission is to enhance the natural beauty of your surroundings while promoting ecological
                    balance and sustainability. We believe that a well-designed landscape can improve quality of
                    life, increase property value, and contribute to a healthier environment.
                </p>
                <p>
                    Thank you for considering us for your landscaping needs. We look forward to working with you
                    to create the outdoor space of your dreams.
                </p>
            </div>
			<div class="about-image">
				<img src="/img/hero_2.webp" alt="" />
			</div>
		</div>
	</section>
</main>
<Footer />
<style>
	section {
        padding-inline: 1.6rem;
		padding-top: 100px;
        
	}
	.section-grid {
        display: grid;
		grid-template-columns: 1fr 1fr;
		margin-block: 0;
        max-height: 90dvh;
        margin-bottom: 6rem;
	}

	.about-image {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.about-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		/* max-width: 400px; */
		max-height: 90dvh;
	}

	.about-info {
		padding-bottom: 2rem;
	}

	h1 {
		margin-bottom: 2rem;
		font-size: var(--fs-xxxxl);
	}

	p {
		font-size: var(--fs-md);
        line-height: 1.1;
        padding-bottom: 1rem;
	}
	@media (max-width: 1440px) {
		.section-grid {
			grid-template-columns: 1fr;
		
		}

		.about-image {
			margin-bottom: 20px;
		}
	}
</style>

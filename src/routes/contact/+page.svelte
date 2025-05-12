<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';

	// magic
</script>

<Seo
	title="Contact Us"
	description="Landscaping services in Cork county that nurture heart, soul, and mind."
/>
<main>
	<section class="section-grid">
		<div class="contact-image">
			<img src="/svg/garden.svg" alt="" />
		</div>

		<div class="contact-info">
			<h2>Contact Us</h2>
			<!-- <p>
				We are here to help you with all your landscaping needs. Whether you have a question, need a
				quote, or want to discuss your project, feel free to reach out to us.
			</p> -->
			<p>
				Whether it’s to discuss your next project, learn more about our services, call us or drop us
				a line and get the conversation started.
			</p>
			<p>
				<strong>Email:</strong> info@example.com
			</p>
			<p>
				<strong>Phone:</strong> (123) 456-7890
			</p>
            <div class="thanks">
                <p>Thank you for your interest</p>
                <!-- <p>We will get back to you as soon as possible.</p> -->
            </div>
			<!-- <div class="contact-form">
				<h2>Get in Touch</h2>
				<form action="/submit" method="POST">
					<label for="name">Name:</label>
					<input type="text" id="name" name="name" required />

					<label for="email">Email:</label>
					<input type="email" id="email" name="email" required />

					<label for="message">Message:</label>
					<textarea id="message" name="message" rows="4" required></textarea>

					<button type="submit">Send Message</button>
				</form>
			</div> -->
		</div>
	</section>
</main>

<style>
	.section-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		/* gap: 240px; */
		margin-block: 0;
		padding-top: 100px;
		max-height: 100dvh;
	}

	.contact-image {
		grid-column: 1/2;
		/* max-height: 90dvh; */
		/* display: flex;
		align-items: center;
		justify-content: center;
        object-fit: contain; */
	}

	.contact-image img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		/* max-width: 400px; */
		max-height: 90dvh;
	}

	.contact-info {
		/* max-width: 400px; */
		/* margin-left: 0; */
	}

	.contact-info h2 {
		font-size: var(--fs-xxxxl);
		margin-bottom: 10px;
	}

	.contact-info p {
		max-width: 64ch;
        margin-bottom: 1rem;
        font-size: var(--fs-xl);
        line-height: 1;
	}
.thanks {
        grid-column: 2/3;
        margin-top: 20px;
    }
    .thanks p {
        /* margin-bottom: 10px; */
        font-size: var(--fs-xxxxxl);
        /* color: var(--clr-accent-dark); */
        line-height: .9;
        font-family: var(--ff-org);
        font-style: italic;
        color: var(--clr-orange);
    }
	/* .contact-form {
		grid-column: 2/3;
		margin-top: 20px;
	} */

	/* .contact-form h2 {
		font-size: 24px;
		margin-bottom: 10px;
	} */

	/* .contact-form label {
		display: block;
		margin-bottom: 5px;
	} */

	/* .contact-form input,
	.contact-form textarea {
		width: 100%;
		padding: 10px;
		margin-bottom: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
	} */

    /* .contact-form button {
		padding: 10px 20px;
		background-color: #28a745;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	} */

    /* .contact-form button:hover {
		background-color: #218838;
	} */
	@media (max-width: 768px) {
		.section-grid {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 480px) {
		.contact-info {
			margin-left: 0;
		}
	}
</style>

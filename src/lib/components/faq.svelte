<script>
	// @ts-nocheck

	import { slide } from 'svelte/transition';

	// FAQ items - Updated with landscaping-specific content
	let faqs = [
		{
			question: 'What services does ABR Landscaping offer?',
			answer:
				'ABR Landscaping offers a wide range of landscaping services including lawn mowing, garden design and installation, tree and shrub care, hardscaping (patios, walkways), irrigation systems, and seasonal cleanups.'
		},
		{
			question: 'How do I get started a landscaping project?',
			answer:
				'You can request a quote by filling out our online contact form or calling us. We typically schedule an on-site consultation to assess your property and discuss your needs before providing a detailed estimate.'
		},
		{
			question: 'What Cork Area You Service ?',
			answer:
				'We primarily serve the Cork City and surrounding areas. Please contact us to confirm if we service your specific location.'
		},
		{
			question: 'Do you offer eco-friendly landscaping solutions?',
			answer:
				'Yes, we are committed to sustainability and offer various eco-friendly options, including native plantings, water-wise irrigation, organic fertilization, and permeable hardscaping materials.'
		},
		{
			question: 'How do you handle billing?',
			answer:
				'We provide detailed invoices upon completion of services or based on the agreed-upon schedule for maintenance plans. We accept various payment methods, which will be outlined in your service agreement or estimate.'
		},
		{
			question: 'Do you require contract?',
			answer:
				'For larger projects and ongoing maintenance plans, we typically use a service agreement outlining the scope of work, schedule, and payment terms. For smaller, one-time services, a formal contract may not always be necessary, but we always provide a clear estimate.'
		}
	];

	// Currently open index
	/**
	 * @type {number | null}
	 */
	let openIndex = null;

	// Toggle logic: only one open at a time
	/**
	 * @param {number | null} index
	 */
	function toggle(index) {
		openIndex = openIndex === index ? null : index;
	}

	/**
	 * Handle keydown for accessibility
	 * @param {KeyboardEvent} event
	 * @param {number} index
	 */
	function handleKeydown(event, index) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault(); // Prevent scrolling on Space
			toggle(index);
		}
	}
</script>

<section class="section-grid">
	<div class="faq-content">
		<h2><span>Common</span> Questions</h2>
		<!-- <h2>Frequently Asked <span>Questions</span></h2> -->

		{#each faqs as faq, i}
			<div class="faq-item" role="group" aria-labelledby="faq-question-{i}">
				<button
					class="faq-question"
					aria-expanded={openIndex === i}
					aria-controls="faq-answer-{i}"
					id="faq-question-{i}"
					onclick={() => toggle(i)}
					onkeydown={(e) => handleKeydown(e, i)}
				>
					<span>{faq.question}</span>
					<span class="icon">{openIndex === i ? '−' : '+'}</span>
				</button>
				{#if openIndex === i}
					<div
						class="faq-answer"
						role="region"
						aria-labelledby="faq-question-{i}"
						id="faq-answer-{i}"
						transition:slide|local={{ duration: 300 }}
					>
						<p>{faq.answer}</p>
					</div>
				{/if}
			</div>
		{/each}
	</div>
	<div class="faq-image">
		<img
			src="https://cdn.sanity.io/images/lbo1agd3/production/5720a23ce2887d55a0dd06972de090606b0109ea-275x283.svg"
			alt="Decorative graphic"
		/>
	</div>
</section>

<style>
	.faq-content {
		grid-column: 2 / span 5;
	}

	.faq-image {
		grid-column: 7 / -1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 2.5rem;
		/* border: 2px solid red; */
	}

	.faq-image img {
		max-width: 80%;
		height: auto;
	}

	.section-grid h2 {
		font-size: var(--fs-xxxl);
		margin-bottom: 2rem;
		letter-spacing: 0.05em;
		max-width: 10ch;
		line-height: .75;
		color: var(--clr-orange); /* Teal color */
	}
	
	.section-grid h2 span {
		font-size: var(--fs-xxl);
		color: var(--clr-accent-mid);
		
		font-style: italic;
		 /* Teal color */
	}

	.faq-item {
		border-bottom: 1px solid #e5e7eb; /* Light gray border */
	}

	.faq-item:last-child {
		border-bottom: none;
	}

	.faq-question {
		font-size: var(--fs-md); /* Larger font size */
		color: var(--clr-text-dark);
		padding-block: 1.25rem;
		cursor: pointer;
		list-style: none;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		transition: color 0.2s ease-in-out;
	}

	.faq-question:hover,
	.faq-question:focus {
		color: var(--clr-orange); /* Teal on hover/focus */
		outline: none; /* Remove default focus outline if needed */
	}

	.faq-question .icon {
		font-size: 1.8em;
		line-height: 1;
		color: var(--clr-accent-mid); /* Teal icon */
		transition: transform 0.3s ease-in-out;
	}

	.faq-answer {
		padding: 0 0 1.5rem 0; /* Padding below question */
	}

	.faq-answer p {
		margin: 0; /* Remove default paragraph margin */
		max-width: 72ch;
	}

	/* Responsive adjustments */

	@media (width < 1024px) {
		.faq-content {
			grid-column: 2 / -2;
		}

		.faq-image {
			/* padding-top: 1rem;
			max-width: 250px;
			margin: 0 auto;  */
			display: none;
		}
	}

	@media (width < 768px) {
		.section-grid {
			flex-direction: column; /* Stack content and image */
			align-items: center; /* Center items when stacked */
		}
		/* .faq-content {
			grid-column: 1 / -1;
		} */

		.section-grid h2 {
			/* font-size: 2rem; */
			/* text-align: center; */
		}

		.faq-question {
			font-size: var(--fs-xs);
			padding: 1.2rem 0;
		}

		.faq-answer {
			/* font-size: 0.95rem; */
		}
	}
	@media (width <= 480px) {
		.faq-question {
			font-size: 1rem;
			padding: 1.2rem 0;
		}
	}
	/* @container (width < 1280px) {
	}
	@container (width < 1024px) {
	}
	@container (width < 992px) {
	}
	@container (width < 768px) {
	}
	@container (width < 480px) {
	} */
</style>

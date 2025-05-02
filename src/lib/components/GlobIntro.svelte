<script>
	// calculate number of years form 2014

	const startYear = 2014;
	const currentYear = new Date().getFullYear();
	const yearsOfExperience = currentYear - startYear;
	const happyClients = 790;
	const projectsCompleted = 400;
	const clientsRetentionRate = 96;
	const introText = `At ABR Landscaping we transform your outdoor space with premium natural paving solutions in Cork area. Whether you envision a classic garden retreat, a sleek modern patio, or a warm, inviting backyard, our expert craftsmanship and high-quality materials ensure a stunning, durable finish built to last.`;
	const summaryData = [
		{ label: `${yearsOfExperience}+`, description: 'Years of Experience' },
		{ label: `${happyClients}+`, description: 'Happy Clients' },
		{ label: `${projectsCompleted}+`, description: 'Projects Completed' },
		{ label: `${clientsRetentionRate}%`, description: 'Clients Retention Rate' }
	];
</script>

<section class="section-grid">
	<div class="content__w">
		<h2><span>Transforming</span> Outdoor Spaces</h2>
		<div class="content">
			<p>
				{introText}
			</p>
			<p>ABR Landscaping - Your Trusted Partner in Cork</p>
		</div>
	</div>
	<div class="summary__w">
		<div class="detail">
			<p>{summaryData[0].label}</p>
			<p>{summaryData[0].description}</p>
		</div>
		<div class="detail">
			<p>{summaryData[1].label}</p>
			<p>{summaryData[1].description}</p>
		</div>
		<div class="detail">
			<p>{summaryData[2].label}</p>
			<p>{summaryData[2].description}</p>
		</div>
		<div class="detail">
			<p>{summaryData[3].label}</p>
			<p>{summaryData[3].description}</p>
		</div>
	</div>
</section>

<style>
	.content__w {
		/* Add your styles here */
		grid-column: 2 / span 4;
		& h2 {
			font-size: var(--fs-xxl);
			margin-bottom: 2rem;
			max-width: 20ch;

			& span {
				color: var(--clr-accent);
			}
		}
		& .content {
			font-size: var(--fs-sm);
			margin-bottom: 2rem;
			color: var(--clr-text-dark);
			& p:first-child {
				margin-bottom: 1.5rem;
			}
		}
	}

	.summary__w {
		/* Add your styles here */
		grid-column: 7 / span 3; /* Ensure summary takes full width */
		display: grid; /* Fixed display property */
		grid-template-columns: repeat(2, 1fr);
		/* grid-template-rows: 2; Four columns for summary items */
		padding: 1rem; /* Added padding for better spacing */
		& .detail {
		
			align-self: flex-start;
			justify-content: center;
			display: flex;
			flex-direction: column;
			text-align: center;
			padding: 1rem;
			font-size: var(--fs-xs); /* Added padding for better spacing */
			& p:first-child {
				font-size: calc(var(--fs-xxl) * 1.2);
				font-family: var(--ff-org);
				color: var(--clr-accent-dark);
				/* margin-bottom: 0.5rem; */
			}
		}
	}
	@media (max-width: 1280px) {
		.section-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
			margin-block: 5rem;
			padding: 2rem;
		}

		.content__w {
			grid-column: 1 / -1;
			/* max-width: 800px; */
			margin: 0 auto;
		}

		.summary__w {
			grid-column: 1 / -1;
			grid-template-columns: repeat(4, 1fr);
			/* max-width: 800px; */
			margin: 0 auto;
			& .detail p:first-child {
				font-size: calc(var(--fs-xxl) * 1.4);
			}
		}
		@media (max-width: 1024px) {
			.section-grid {
				grid-template-columns: 1fr;
				gap: 2rem;
				margin-block: 5rem;
				padding: 2rem;
			}

			.content__w {
				grid-column: 1 / -1;
				/* max-width: 800px; */
				margin: 0 auto;
			}

			.summary__w {
				grid-column: 1 / -1;
				grid-template-columns: repeat(4, 1fr);
				max-width: 800px;
				margin: 0 auto;
			}
		}
	}
	/* Add additional breakpoint for even smaller screens */
	@media (max-width: 768px) {
		.section-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
			margin-block: 2rem;
			padding: 2rem;
		}
		.summary__w {
			grid-template-columns: repeat(2, 1fr);
			padding: 0;
			margin: 0;
		}

		.content__w h2 {
			/* font-size: calc(var(--fs-xl)); */
		}

		.summary__w .detail p:first-child {
			font-size: calc(var(--fs-xxl) * 1.6);
		}
	}
	@media (max-width: 480px) {
		.section-grid {
			grid-template-columns: 1fr;
			/* gap: 2rem; */
			margin-block: 3rem;
			padding: 1rem;
		}

		.content__w {
			grid-column: 1 / -1;
			/* max-width: 800px; */
			margin: 0 auto;
		}

		.summary__w {
			grid-column: 1 / -1;
			grid-template-columns: repeat(2, 1fr);
			padding: 0;
			margin: 0;
			& p {
				font-size: calc(var(--fs-xs) * 0.8);
			}
		}
	}
</style>

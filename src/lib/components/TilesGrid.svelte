<script>
	let { items } = $props();
</script>

<div class="tiles__c">
	<h2><span>Services</span> we offer</h2>
	<div class="tiles-grid">
		{#each items as item}
			<div class="tile-card">

				<a href={item.slug} aria-label={`Go to ${item.title}`}>
					<div class="arrow-icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="64"
							height="64"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-arrow-up-right-icon lucide-arrow-up-right"
							><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg
						>
					</div>
				</a>
				<img src={item.thumb} alt="" />
				<div class="tile-content">
					<h2>{item.title}</h2>
					{#each item.shorts as short}
						<p>{short.text}</p>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.tiles__c {
		margin-top: 10rem;
	}

	.tiles-grid {
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		gap: 8px;
		/* margin-bottom: 40px; */
	}

	.tile-card {
		position: relative;
		overflow: hidden;
		border-radius: 4px;
		/* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */

}
	.tile-card::before {
		content: "";
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		/* Example gradient: dark at bottom, transparent at top */
		background: linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.25) 90%, transparent 100%);
	}
	.tile-card:nth-child(4n + 4) {
		grid-column: span 6; /* Second card in even rows */
	}

	.tile-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	
/* Card sizes based on the pattern */
/* First row and odd rows follow 6-4 pattern */
.tile-card:nth-child(4n + 1) {
	grid-column: span 6; /* First card in odd rows */
}

.tile-card:nth-child(4n + 2) {
	grid-column: span 4; /* Second card in odd rows */
}

/* Even rows follow 4-6 pattern (reversed) */
.tile-card:nth-child(4n + 3) {
	grid-column: span 4; /* First card in even rows */
}

.tile-card:nth-child(4n + 4) {
	grid-column: span 6; /* Second card in even rows */
}


.tile-content {
	position: absolute;
;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 24px;
		color: white;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
	}

	.tile-content h2 {
		font-size: var(--fs-lg);
		margin-bottom: 10px;
		color: var(--clr-bg);
	}

	.tile-content p {
		font-size: var(--fs-xs);
		font-family: var(--ff-light);
		letter-spacing: 0.08rem;
	}
	.arrow-icon {
        position: absolute;
		bottom: 20px;
		right: 20px;
		width: 64px;
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--clr-bg);
		z-index: 1;
		transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
		/* Add smooth transform for rotation */
		transform: rotate(0deg);
	}
	.arrow-icon:hover {
		transform: rotate(45deg) scale(1.2);
	}
	/* Responsive adjustments */
	@media (width < 1280px) {
		.tiles__c {
			/* padding: 0 24px; */
		}
		.tile-card:nth-child(n) {
			grid-column: span 5;
			aspect-ratio: 3/2;
			width: 100%;
		}
		.tile-content p {
			font-size: var(--fs-xs);
			font-family: var(--ff-light);
			margin-bottom: 0px;
			letter-spacing: 0.0258rem;
		}
	}
	@media (width < 1024px) {
		.tiles__c {
			/* padding: 0 16px; */
		}
		.tile-card:nth-child(n) {
			.tile-content {
				padding: 20px;
			}
			& .tile-content p {
				font-size: var(--fs-xxs);
				font-family: var(--ff-light);
				margin-bottom: 0px;
				letter-spacing: 0.0258rem;
			}
		}
	}

	@media (width < 960px) {
		.tiles__c {
			/* padding: 0 12px; */
		}
		.tile-card:nth-child(n) {
			grid-column: 1 / -1;
			aspect-ratio: 2/1;
			width: 100%;
		}
		.tile-content p {
			font-size: var(--fs-xxs);
			margin-bottom: 0px;
		}
	}

	@media (width < 640px) {
		.tiles__c {
			/* padding: 0 8px; */
		}
		.tile-card:nth-child(n) {
			grid-column: 1 / -1;
			aspect-ratio: 2/1;
			width: 100%;
		}
		.tile-content p {
			font-size: var(--fs-xxs);
			margin-bottom: 0px;
		}
	}
</style>

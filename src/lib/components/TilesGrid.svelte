<script>
	import { page } from '$app/state';
	import ResponsiveImg from './ResponsiveImg.svelte';

	let { items, rootPath } = $props();
</script>

<section class="section-grid">
	{#if page.url.pathname === '/services'}
		<h2><span>Services</span> we provide</h2>
	{:else if page.url.pathname === '/projects'}
		<h2><span>Our</span> Portfolio</h2>
	{:else}
		<h2><span class="upper-text">Services</span> we provide</h2>
	{/if}
	<div class="tiles-grid">
		{#each items as item}
			<div class="tile-card">
				<a href={`${rootPath}/${item.slug}`} aria-label={`Go to ${item.title}`}>
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
				<ResponsiveImg image={item.thumb} alt="" />
				<div class="tile-content">
					{#if item.title}
						<h3>{item.title}</h3>
					{:else}
						<h3>{item.location}</h3>
					{/if}
					{#if item.shorts}
						{#each item.shorts as short}
							<p>{short.text}</p>
						{/each}
					{:else}
						<p>{item.premiseType.type}</p>
					{/if}
				</div>
			</div>
		{/each}
		<!-- if url is homepage -->
		{#if page.url.pathname === '/'}
			<div class="tile-card last">
				<p>{`check our comprehensive range of ${rootPath}`}</p>
				<!-- <p>all services</p> -->
				<a href={rootPath} aria-label={`Go to ${rootPath}`}>
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
			</div>
		{/if}
	</div>
</section>

<style>
	.section-grid {
		margin-top: 4rem;

		& h2 {
			position: relative;
			grid-column: 1 / -1;
			font-size: var(--fs-xxxxl);
			color: var(--clr-accent-dark);
			/* font-style: italic; */
			margin-bottom: 1rem;
			& span {
				position: absolute;
				top: calc(-28% - 1rem);
				left: 0;
				width: 100%;
				pointer-events: none;
				color: var(--clr-orange);
				font-size: var(--fs-xxl);
				z-index: -1;
			}
		}
	}

	.tiles-grid {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		gap: 8px;
		/* margin-bottom: 40px; */
	}

	.tile-card {
		position: relative;
		overflow: hidden;
		border-radius: 0.25rem;
		max-height: 480px;
		/* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
	}
	.tile-card::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		&:not(.last) {
			background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.35) 100%);
		}
	}

	/* .tile-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	} */

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

	.tile-card.last {
		position: relative;
		padding: 40px;

		/* overflow: hidden; */
		& p {
			font-size: var(--fs-xxl);
			color: var(--clr-bg);
			font-family: var(--ff-org);
			letter-spacing: 0.08rem;
			line-height: 1.1;
			margin-bottom: 3rem;
			position: relative;
			z-index: 1;
			width: 16ch;
			text-shadow: 0 6px 8px rgba(0, 0, 0, 0.5);
		}
		&::after {
			content: '';
			position: absolute;
			inset: 0;
			background-color: var(--clr-accent);
			background-image: url('/svg/garden-h.svg');
			background-size: cover;
			background-repeat: no-repeat;

			z-index: 0;
		}
	}

	.tile-content {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 24px;
		color: white;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
	}

	.tile-content h3 {
		font-size: var(--fs-lg);
		margin-bottom: 10px;
		color: var(--clr-bg);
		width: 20ch;
		text-shadow: 4px 3px 4px rgba(0, 0, 0, 0.5);
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
		.section-grid {
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
		.section-grid {
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
		.section-grid {
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
		.section-grid {
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

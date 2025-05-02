<script lang="ts">
	import { browser } from '$app/environment';
	// Import tick if needed for class timing, though setTimeout might suffice

	let items = $state([
		{
			url: 'https://cdn.sanity.io/images/lbo1agd3/production/ec0e3c0f8328af7a6f79e07fb4fcbaef996bacb1-1000x688.jpg', // Placeholder - maybe a nice patio shot
			projectType: 'Patio Installation',
			testimonial:
				'We are absolutely thrilled with our new patio! The team was professional, meticulous, and the final result is stunning. It has completely transformed our outdoor living space.',
			name: 'Mark & Lisa'
		},
		{
			url: 'https://cdn.sanity.io/images/lbo1agd3/production/4e0d61ef665efb6c35468b23a2d63d2900941278-1000x688.jpg', // Placeholder - maybe a lush garden
			projectType: 'Garden Makeover',
			testimonial:
				'Our garden was tired and overgrown. They listened to our ideas and created a beautiful, low-maintenance design that we love. Highly recommended for their creativity and hard work.',
			name: 'Jennifer S.'
		},
		{
			url: 'https://cdn.sanity.io/images/lbo1agd3/production/8172da50f52752c1063fe4d9d9dfc6922cba0d86-1000x688.jpg', // Placeholder - maybe a paved driveway
			projectType: 'Driveway Paving',
			testimonial:
				"Excellent job on our new driveway. The quality of the paving is top-notch, and the crew was efficient and tidy. It has significantly improved our home's curb appeal.",
			name: 'David Chen'
		},
		{
			url: 'https://cdn.sanity.io/images/lbo1agd3/production/6a09c087b2ece7598870e6babf9a4543ec00d210-1000x688.jpg', // Placeholder - maybe a neat lawn/hedges
			projectType: 'Lawn & Hedge Maintenance',
			testimonial:
				'Reliable, friendly, and they always leave our property looking immaculate. Taking care of the lawn and hedges used to be a chore, but now we can just enjoy it.',
			name: 'The Robertsons'
		},
		{
			url: 'https://cdn.sanity.io/images/lbo1agd3/production/e2083e991bd66ee6ac1dcce5ce6649ac7cccafed-1440x961.webp', // Placeholder - maybe a retaining wall or steps
			projectType: 'Retaining Wall & Steps',
			testimonial:
				'The new retaining wall and garden steps look fantastic and are built to last. They solved our slope problem beautifully. Very professional from start to finish.',
			name: 'Brian T.'
		},
		{
			url: 'https://cdn.sanity.io/images/lbo1agd3/production/1816dd630f6ef5c83067daeffa1c65915ec7901a-1440x800.webp', // Placeholder - maybe a full landscape project
			projectType: 'Full Landscape Design',
			testimonial:
				'From the initial design consultation to the final planting, the entire process was seamless. They transformed our blank canvas into a stunning landscape we enjoy every day.',
			name: 'Sarah W.'
		}
	]);

	let slider: HTMLDivElement | undefined = $state();
	// Make autoRunInterval a regular variable, not $state, to avoid potential effect loops
	let autoRunInterval: ReturnType<typeof setInterval> | undefined;
	const autoRunDelay = 8000; // ms
	const animationSpeed = 1000; // ms - Should match CSS --speed

	let currentSlideIndex = $state(0);
	let previousSlideIndex = $state<number | null>(null);
	let isAnimating = $state(false);
	let isPaused = $state(false); // State to control pausing via hover

	function triggerSlide(direction: 'next' | 'prev') {
		// Prevent starting a new animation if one is already running or if there's only one item
		if (isAnimating || items.length < 2) return;
		isAnimating = true;
		previousSlideIndex = currentSlideIndex;

		if (direction === 'next') {
			currentSlideIndex = (currentSlideIndex + 1) % items.length;
		} else {
			currentSlideIndex = (currentSlideIndex - 1 + items.length) % items.length;
		}

		// Use setTimeout to reset isAnimating after the CSS animation duration
		setTimeout(() => {
			previousSlideIndex = null; // Clear previous index after animation
			isAnimating = false;
		}, animationSpeed);
	}

	// Helper function to safely clear the interval
	function clearIntervalIfNeeded() {
		if (browser && autoRunInterval) {
			clearInterval(autoRunInterval);
			autoRunInterval = undefined; // Reset the variable
		}
	}

	// Helper function to safely start the interval
	function startInterval() {
		clearIntervalIfNeeded(); // Ensure any existing interval is cleared first
		if (browser) {
			autoRunInterval = setInterval(() => {
				// Check flags inside the interval callback before triggering
				if (!isAnimating && !isPaused) {
					triggerSlide('next');
				}
			}, autoRunDelay);
		}
	}

	// Function to reset the interval timer (e.g., after manual interaction)
	function resetInterval() {
		// Only reset if the carousel is not paused
		if (browser && !isPaused) {
			startInterval(); // This clears the old timer and starts a new one
		}
	}

	// --- Manual Navigation ---
	function nextSlide() {
		triggerSlide('next');
		resetInterval(); // Reset the auto-run timer after manual navigation
	}

	function prevSlide() {
		triggerSlide('prev');
		resetInterval(); // Reset the auto-run timer after manual navigation
	}

	// --- Dynamic Class Calculation ---
	function getClass(index: number): string {
		let classes = 'item';
		if (index === currentSlideIndex) {
			classes += ' current'; // The currently visible slide
		} else if (index === previousSlideIndex && isAnimating) {
			// The slide that is animating out (splitting)
			classes += ' previous animate-split-out';
		} else {
			// All other slides are hidden
			classes += ' hidden';
		}
		return classes;
	}

	// --- Auto Run Control using $effect ---
	$effect(() => {
		// This effect manages the interval based on the isPaused state
		if (browser) {
			if (isPaused) {
				clearIntervalIfNeeded(); // Clear interval when paused
			} else {
				startInterval(); // Start interval when not paused (initial run or resume)
			}
		}

		// Return a cleanup function that runs when the component unmounts
		// or when the effect re-runs (before starting the new logic)
		return () => {
			clearIntervalIfNeeded();
		};
	});

	// --- Pause/Resume on Hover ---
	function pauseAutoRun() {
		if (browser) {
			isPaused = true; // Set paused state, the $effect will clear the interval
		}
	}

	function resumeAutoRun() {
		if (browser) {
			isPaused = false; // Clear paused state, the $effect will start the interval
			// resetInterval(); // Optionally restart timer delay immediately on mouse leave
		}
	}
	// --- Window Resize Handling ---
	let innerWidth = $state(0);
</script>

<svelte:window bind:innerWidth />
<section class="section-grid">
	<div
		class="slider"
		bind:this={slider}
		onmouseenter={pauseAutoRun}
		onmouseleave={resumeAutoRun}
		role="region"
		aria-roledescription="carousel"
		aria-label="Image Carousel - Split Effect"
	>
		<!-- list item -->
		{#each items as item, index (item.url)}
			<div
				class={getClass(index)}
				aria-hidden={index !== currentSlideIndex}
				aria-roledescription="slide"
				style={index === previousSlideIndex ? `--bg-image: url(${item.url})` : ''}
			>
				<!-- Image is used as fallback and for dimensions, but hidden during split -->
				<img src={item.url} alt={item.projectType} />
				{#if innerWidth >= 768}
					<div class="content">
						<div class="projectType">{item.projectType}</div>
						<div class="description">
							<p>{item.testimonial}</p>
							<p>{item.name}</p>
						</div>
					</div>
				{/if}
			</div>
		{/each}

		<div class="arrows">
			<button aria-label="Previous slide" onclick={prevSlide} disabled={isAnimating}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
				</svg>
			</button>
			<button aria-label="Next slide" onclick={nextSlide} disabled={isAnimating}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
				</svg>
			</button>
		</div>
	</div>
	{#if innerWidth < 768}
		<div class="testimonial">
			{#each items as item, index (item.url)}
				{#if index === currentSlideIndex}
					<div class="testimonial-item active">
						<div class="projectType">{item.projectType}</div>
						<div class="description">
							<p>{item.testimonial}</p>
							<p>{item.name}</p>
						</div>
					</div>
				{:else}
					<div class="testimonial-item">
						<div class="projectType">{item.projectType}</div>
						<div class="description">
							<p>{item.testimonial}</p>
							<p>{item.name}</p>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</section>

<style>
	:root {
		--speed: 1000ms; /* Animation duration - match JS const */
		--content-anim-duration: 800ms; /* Duration for content fade/slide in */
		--content-entry-delay: 1600ms; /* Delay after split before content animates in */
	}

	.slider {
		position: relative;
		width: 100%;
		grid-column: 1 / -1;
		/* max-height: 900px; Or specific height */
		aspect-ratio: 16/9; /* Maintain aspect ratio */
		/* border-radius: 0.5rem; */
		overflow: hidden;
	}

	.item {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0; /* Hidden by default */
		pointer-events: none; /* Non-visible items shouldn't be interactive */
		overflow: hidden; /* Clip content during animation if needed */
		z-index: 0; /* Default stacking */
		border-radius: 0.5rem;
	}
	.item.hidden {
		/* Explicitly hidden state */
		opacity: 0;
		pointer-events: none;
		z-index: 0;
	}

	.item img {
		position: absolute; /* Position within the item */
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block; /* Remove potential extra space */
		opacity: 1; /* Visible by default */
	}

	.item.current {
		opacity: 1;
		pointer-events: auto; /* Current item is interactive */
		z-index: 1; /* Base level for visible slide (below previous) */
	}
	.item.previous {
		opacity: 1; /* Keep item itself technically visible for pseudo-elements */
		pointer-events: none; /* Don't interact with outgoing slide */
		z-index: 2; /* Outgoing slide animates *on top* of incoming */
	}

	/* Hide the actual image element on the splitting slide immediately */
	.item.previous img {
		opacity: 0;
		transition: none; /* Make it immediate */
	}

	/* --- Pseudo-elements for Splitting --- */
	.item.previous::before,
	.item.previous::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		width: 50%; /* Each pseudo-element takes half the width */
		height: 100%;
		background-image: var(--bg-image); /* Set via inline style */
		/* Make the background twice as wide as the pseudo-element */
		/* so each half shows the correct portion of the original image */
		background-size: 200% auto; /* Prevents flicker on split */
		background-repeat: no-repeat;
		z-index: 3; /* Above hidden image, below content */
		will-change: transform; /* Optimize animation */
	}

	.item.previous::before {
		left: 0;
		/* Position the background to show the left half of the full image */
		background-position: 0% 50%; /* or left center */
	}

	.item.previous::after {
		right: 0;
		/* Position the background to show the right half of the full image */
		background-position: 100% 50%; /* or right center */
	}

	/* --- Animations --- */
	/* Assign animations based on dynamic classes */

	/* Outgoing Slide Animation (Splitting) */
	.item.animate-split-out::before {
		animation: split-out-left var(--speed) ease-in-out forwards;
	}
	.item.animate-split-out::after {
		animation: split-out-right var(--speed) ease-in-out forwards;
	}

	/* Incoming slide just appears (due to z-index and opacity), no specific animation needed */

	/* --- Keyframes (Split using translateX) --- */
	@keyframes split-out-left {
		0% {
			transform: translateX(0%);
		}
		100% {
			/* Move the left half completely off-screen to the left */
			transform: translateX(-100%);
		}
	}
	@keyframes split-out-right {
		0% {
			transform: translateX(0%);
		}
		100% {
			/* Move the right half completely off-screen to the right */
			transform: translateX(100%);
		}
	}

	/* --- Content Styling & Animation --- */
	.content {
		width: min(80vw, 450px); /* Responsive width */
		position: absolute;
		bottom: 5%; /* Position from bottom */
		right: 5%; /* Position from left */
		z-index: 4; /* Content above splitting pseudo-elements */
		color: var(--clr-bg);
		/* text-shadow: 0 2px 5px rgba(0, 0, 0, 0.8); */
		background-color: rgba(0, 0, 0, 0.345);
		backdrop-filter: blur(8px); /* Optional: frosted glass effect */
		border-radius: 0.5rem;
		padding: 1.4rem;
		opacity: 0; /* Hidden by default, start position for incoming */
		transform: translateY(24px); /* Start position for incoming, end position for outgoing */
		/* Default transition for INCOMING content */
		transition:
			opacity var(--content-anim-duration) ease-out,
			transform var(--content-anim-duration) ease-out;
		/* Delay is handled by .item.current .content */
		display: flex; /* Use flex for layout */
		flex-direction: column;
		gap: 0.8rem; /* Space between projectType/desc */
		pointer-events: none; /* Prevent interaction when hidden */
		will-change: opacity, transform;
		@media (width < 768px) {
			width: 90%;
		}
	}

	/* Animate INCOMING content */
	.item.current .content {
		opacity: 1; /* Fade in content on the current slide */
		transform: translateY(0); /* Move up to final position */
		/* Delay the incoming animation until split + delay */
		transition-delay: calc(var(--speed) + var(--content-entry-delay));
		pointer-events: auto; /* Allow interaction */
	}

	/* Animate OUTGOING content */
	.item.previous .content {
		opacity: 0; /* Target state for outgoing */
		transform: translateY(24px); /* Target state for outgoing */
		/* Outgoing animation matches the split duration and starts immediately */
		transition-duration: var(--speed);
		transition-delay: 0s;
		pointer-events: none; /* Disable interaction immediately */
	}

	.content .projectType,
	.testimonial .projectType {
		font-size: var(--fs-md);
		line-height: 1.1;
		letter-spacing: 0.05em;
		margin-bottom: 12px;
		&:after {
			content: '';
			display: block;
			width: 50px;
			height: 2px;
			background-color: var(--clr-accent);
			margin-top: 0.5rem;
		}
	}
	.content .description,
	.testimonial .description {
		/* font-size: clamp(0.9rem, 2vw, 1.1rem); */
		font-size: var(--fs-xs);
		line-height: 1.2;
		& :first-child {
			margin-bottom: 1rem;
		}
		& :last-child {
			font-size: var(--fs-sm);
			&:before {
				content: '—  ';
			}
		}
	}
	.testimonial {
		grid-column: 1 / -1;
		grid-row: 2 / 3;

		padding: 1rem;
		border-radius: 0.5rem;
		color: var(--clr-bg);
		background-color: rgba(6, 35, 26, 0.75);

		/* --- Add these styles --- */
		display: grid; /* Use grid to stack items */
		/* Ensures the container sizes to the tallest item */
		min-height: 0; /* Prevents potential intrinsic sizing issues */
		position: relative; /* Optional, but good practice for stacking context */
		overflow: hidden; /* Clip content if needed during transitions */
	}

	/* --- Add these new styles --- */
	.testimonial-item {
		/* Place all items in the same grid cell */
		grid-area: 1 / 1 / 2 / 2;

		/* Default state: hidden */
		opacity: 0;
		pointer-events: none; /* Prevent interaction when hidden */
		visibility: hidden; /* Hide from accessibility tree when not active */

		/* Smooth transition for fade effect */
		transition:
			opacity 0.4s ease-in-out,
			visibility 0s linear 0.4s;

		/* Inherit text alignment or set as needed */
		text-align: left; /* Or center, etc. */
	}

	.testimonial-item.active {
		/* Active state: visible */
		opacity: 1;
		pointer-events: auto;
		visibility: visible;
		transition:
			opacity 0.4s ease-in-out,
			visibility 0s linear 0s;
		position: relative; /* Ensure it's drawn on top if z-index issues arise */
		z-index: 1;
	}

	/* Keep existing styles for .projectType and .description within .testimonial */
	.testimonial .projectType {
		font-size: var(--fs-md);
		line-height: 1.1;
		letter-spacing: 0.05em;
		margin-bottom: 12px;
		&:after {
			content: '';
			display: block;
			width: 50px;
			height: 2px;
			background-color: var(--clr-accent);
			margin-top: 0.5rem;
		}
	}
	.testimonial .description {
		font-size: var(--fs-xs);
		line-height: 1.2;
		& :first-child {
			margin-bottom: 1rem;
		}
		& :last-child {
			font-size: var(--fs-sm);
			&:before {
				content: '—  ';
			}
		}
	}

	/* --- Arrows Styling --- */
	.arrows {
		position: absolute;
		top: 50%;
		width: 95%; /* Position near edges */
		left: 50%;
		transform: translateX(-50%) translateY(-50%);
		display: flex;
		justify-content: space-between;
		z-index: 10; /* Arrows above everything */
		pointer-events: none; /* Container doesn't block clicks */
	}

	.arrows button {
		width: var(--fs-xxxl);
		height: var(--fs-xxxl);
		border-radius: 0.5rem;
		background-color: rgba(255, 255, 255, 0.3);
		border: none;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: background-color 0.3s ease;
		pointer-events: auto; /* Buttons are clickable */
		backdrop-filter: blur(2px); /* Optional: frosted glass effect */
	}
	.arrows button:hover:not(:disabled) {
		background-color: rgba(255, 255, 255, 0.6);
	}
	.arrows button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.arrows button svg {
		width: 24px;
		height: 24px;
		stroke: var(--clr-bg); /* White arrows */
		stroke-width: 2; /* Slightly thicker */
	}
	@media (width> 320px) and (width < 620px) {
		.slider {
			/* aspect-ratio:4/3; */
			& .arrows button {
				width: var(--fs-xxxxxl);
				height: var(--fs-xxxxxl);
			}
			.content {
				visibility: hidden;
			}
			& .projectType {
				font-size: var(--fs-sm);
			}
			& .description {
				font-size: var(--fs-xs);
			}
		}
	}
</style>

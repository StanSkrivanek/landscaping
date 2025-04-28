<script lang="ts">
	import { BROWSER } from 'esm-env';
	// Import tick if needed for class timing, though setTimeout might suffice

	let items = $state([
		{
			url: 'https://cdn.sanity.io/images/lbo1agd3/production/ec0e3c0f8328af7a6f79e07fb4fcbaef996bacb1-1000x688.jpg',
			title: 'Slide 1',
			description: 'Description for Slide 1'
		},
		{
			url: 'https://cdn.sanity.io/images/lbo1agd3/production/4e0d61ef665efb6c35468b23a2d63d2900941278-1000x688.jpg',
			title: 'Slide 2',
			description: 'Description for Slide 2'
		},
		{
			url: 'https://cdn.sanity.io/images/lbo1agd3/production/8172da50f52752c1063fe4d9d9dfc6922cba0d86-1000x688.jpg',
			title: 'Slide 3',
			description: 'Description for Slide 3'
		},
		{
			url: 'https://cdn.sanity.io/images/lbo1agd3/production/6a09c087b2ece7598870e6babf9a4543ec00d210-1000x688.jpg',
			title: 'Slide 4',
			description: 'Description for Slide 4'
		}
	]);

	let slider: HTMLDivElement | undefined = $state();
	// Make autoRunInterval a regular variable, not $state, to avoid potential effect loops
	let autoRunInterval: ReturnType<typeof setInterval> | undefined;
	const autoRunDelay = 5000; // ms
	const animationSpeed = 800; // ms - Should match CSS --speed

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
		if (BROWSER && autoRunInterval) {
			clearInterval(autoRunInterval);
			autoRunInterval = undefined; // Reset the variable
		}
	}

	// Helper function to safely start the interval
	function startInterval() {
		clearIntervalIfNeeded(); // Ensure any existing interval is cleared first
		if (BROWSER) {
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
		if (BROWSER && !isPaused) {
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
			// classes += ' hidden';
		}
		return classes;
	}

	// --- Auto Run Control using $effect ---
	$effect(() => {
		// This effect manages the interval based on the isPaused state
		if (BROWSER) {
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
		if (BROWSER) {
			isPaused = true; // Set paused state, the $effect will clear the interval
		}
	}

	function resumeAutoRun() {
		if (BROWSER) {
			isPaused = false; // Clear paused state, the $effect will start the interval
			// Optional: uncomment the line below if you want the timer delay
			// to restart immediately when the mouse leaves the slider.
			// resetInterval();
		}
	}
</script>

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
			<img src={item.url} alt={item.title} />

			<div class="content">
				<div class="title">{item.title}</div>
				<div class="description">
					{item.description}
				</div>
				<!-- Optional: Add a button or link -->
				<!-- <button>See More</button> -->
			</div>
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
				class="size-6"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
			</svg>
		</button>
	</div>
	<!-- Thumbnail navigation might need different logic if implemented -->
	<!-- <div class="nav"> ... </div> -->
</div>

<style>
	:root {
		--speed: 800ms; /* Animation duration - match JS const */
		--content-anim-duration: 500ms; /* Duration for content fade/slide in */
		--content-entry-delay: 300ms; /* Delay after split before content animates in */
	}

	.slider {
		position: relative;
		width: 100%;
		height: 900px; /* Or specific height */
		/* overflow: hidden; */ /* Removed overflow hidden to ensure pseudo-elements are visible */
		background-color: #333; /* Background shown during transitions */
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
		/* background-color: #000; */ /* Removed: Fallback background for item - this might have caused the black flash */
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
		/* Remove transition delay that was hiding the incoming image */
		/* transition: opacity 0s linear var(--speed); */
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
		width: 50%;
		height: 100%;
		background-image: var(--bg-image); /* Set via inline style */
		background-size: cover; /* Or contain */
		background-repeat: no-repeat;
		z-index: 3; /* Above hidden image, below content */
		will-change: transform; /* Optimize animation */
	}

	.item.previous::before {
		left: 0;
		background-position: left center; /* Show left half */
	}

	.item.previous::after {
		right: 0;
		background-position: right center; /* Show right half */
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
			transform: translateX(-100%);
		}
	}
	@keyframes split-out-right {
		0% {
			transform: translateX(0%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	/* --- Content Styling & Animation --- */
	.content {
		width: min(80vw, 450px); /* Responsive width */
		position: absolute;
		bottom: 10%; /* Position from bottom */
		left: 5%; /* Position from left */
		z-index: 4; /* Content above splitting pseudo-elements */
		color: white;
		text-shadow: 0 2px 5px rgba(0, 0, 0, 0.8);
		opacity: 0; /* Hidden by default, start position for incoming */
		transform: translateY(24px); /* Start position for incoming, end position for outgoing */
		/* Default transition for INCOMING content */
		transition:
			opacity var(--content-anim-duration) ease-out,
			transform var(--content-anim-duration) ease-out;
		/* Delay is handled by .item.current .content */
		display: flex; /* Use flex for layout */
		flex-direction: column;
		gap: 0.8rem; /* Space between title/desc */
		pointer-events: none; /* Prevent interaction when hidden */
		will-change: opacity, transform;
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

	.content .title {
		font-size: clamp(1.5rem, 4vw, 2.5rem); /* Responsive font size */
		font-weight: 700;
		text-transform: uppercase;
		line-height: 1.1;
	}
	.content .description {
		font-size: clamp(0.9rem, 2vw, 1.1rem);
		line-height: 1.6;
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
		width: 44px;
		height: 44px;
		border-radius: 50%;
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
		stroke: #fff; /* White arrows */
		stroke-width: 2; /* Slightly thicker */
	}
</style>

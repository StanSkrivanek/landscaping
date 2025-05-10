<script>
	import ResponsiveImg from "./ResponsiveImg.svelte";

	let { items = [] } = $props();
	// Lightbox state
	let lightboxOpen = $state(false);
	let currentImageIndex = $state(0);

	// Open lightbox with the clicked image
	/**
	 * @param {number} index
	 */
	function openLightbox(index) {
		currentImageIndex = index;
		lightboxOpen = true;
		// Prevent scrolling when lightbox is open
		document.body.style.overflow = 'hidden';
	}

	// Close lightbox
	function closeLightbox() {
		lightboxOpen = false;
		// Re-enable scrolling
		document.body.style.overflow = 'auto';
	}

	// Navigate to next/previous image
	function nextImage() {
		currentImageIndex = (currentImageIndex + 1) % items.length;
	}

	function prevImage() {
		currentImageIndex = (currentImageIndex - 1 + items.length) % items.length;
	}

	// Handle keyboard navigation
	/**
	 * @param {{ key: any; }} e
	 */
	function handleKeydown(e) {
		if (!lightboxOpen) return;

		switch (e.key) {
			case 'Escape':
				closeLightbox();
				break;
			case 'ArrowRight':
				nextImage();
				break;
			case 'ArrowLeft':
				prevImage();
				break;
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<section class="section-grid">
	<div class="tiles-grid">
		{#each items as item, index}
			<div
				class="tile-card"
				onclick={() => openLightbox(index)}
				onkeydown={(e) => e.key === 'Enter' && openLightbox(index)}
				tabindex="0"
				role="button"
			>
				<img src={item.imageUrl} alt="" />
			</div>
		{/each}
	</div>
</section>
<!-- svelte(a11y_no_static_element_interactions) -->
<!-- Lightbox overlay -->
{#if lightboxOpen}
	<div
		role="button"
		class="lightbox-overlay"
		onclick={closeLightbox}
		aria-label="Close lightbox"
		tabindex="0"
		onkeydown={(e) => e.key === 'Enter' && closeLightbox()}
	>
		<div
			role="button"
			class="lightbox-content"
			onclick={(e) => e.stopPropagation()}
			aria-label="Lightbox content"
			tabindex="0"
			onkeydown={(e) => e.key === 'Enter' && closeLightbox()}
		>
			<button class="lightbox-close" onclick={closeLightbox} aria-label="Close lightbox">×</button>
			<button class="lightbox-nav prev" onclick={prevImage} aria-label="Previous image">❮</button>
			<div class="lightbox-image-container">
				<ResponsiveImg image={items[currentImageIndex].imageUrl} alt="" />
			</div>
			<button class="lightbox-nav next" onclick={nextImage} aria-label="Next image">❯</button>
		</div>
	</div>
{/if}

<style>
	.section-grid {
		margin-top: 4rem;
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
	/* Lightbox styles */
	.lightbox-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.9);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.lightbox-content {
		position: relative;
		width: 90%;
		height: 90%;
		display: flex;
		align-items: center;
	}

	.lightbox-image-container {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.lightbox-image-container img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	.lightbox-close {
		position: absolute;
		top: -40px;
		right: 0;
		background: transparent;
		border: none;
		color: white;
		font-size: 2rem;
		cursor: pointer;
		z-index: 1001;
	}

	.lightbox-nav {
		position: absolute;
		background: transparent;
		border: none;
		color: white;
		font-size: 2rem;
		padding: 1rem;
		cursor: pointer;
		z-index: 1001;
		opacity: 0.7;
	}

	.lightbox-nav:hover {
		opacity: 1;
	}

	.lightbox-nav.prev {
		left: -60px;
	}

	.lightbox-nav.next {
		right: -60px;
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
	}
	@media (width < 1024px) {
		.section-grid {
			/* padding: 0 16px; */
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
		.lightbox-nav.prev {
			left: 10px;
		}

		.lightbox-nav.next {
			right: 10px;
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
	}
</style>

<!-- ImgCarousel.svelte (Conceptual Refactor Snippet) -->
<script lang="ts">
	//  slide type definition
	type Slide = {
		id: string;
		imageUrl: string;
		thumbUrl: string;
		title: string;
		description: string;
	};

	const slides = [
		{
			id: '1',
			imageUrl:
				'https://cdn.sanity.io/images/lbo1agd3/production/1816dd630f6ef5c83067daeffa1c65915ec7901a-1440x800.webp',
			thumbUrl:
				'https://cdn.sanity.io/images/lbo1agd3/production/1816dd630f6ef5c83067daeffa1c65915ec7901a-1440x800.webp',
			title: 'Slide 1',
			description: 'Description for Slide 1'
		},
		{
			id: '2',
			imageUrl:
				'https://cdn.sanity.io/images/lbo1agd3/production/e2083e991bd66ee6ac1dcce5ce6649ac7cccafed-1440x961.webp',
			thumbUrl:
				'https://cdn.sanity.io/images/lbo1agd3/production/e2083e991bd66ee6ac1dcce5ce6649ac7cccafed-1440x961.webp',
			title: 'Slide 2',
			description: 'Description for Slide 2'
		}
		// ... more slides
	];

	export let items: Slide[] = slides; // Accept items as a prop
	let currentSlideIndex = 0;
	// ... (logic to handle next/prev clicks by updating currentSlideIndex)
	// ... (logic for auto-advance using setInterval/setTimeout, cleared in onDestroy)

	function next() {
		currentSlideIndex = (currentSlideIndex + 1) % items.length;
	}

	function prev() {
		currentSlideIndex = (currentSlideIndex - 1 + items.length) % items.length;
	}

	// Handle auto-play and cleanup in onMount/onDestroy
</script>

<div class="carousel">
	<div class="list">
		{#each items as item, index (item.id)}
			<!-- Use a unique key -->
			<!-- Use Svelte transitions/animations or conditional classes based on currentSlideIndex -->
			<div class="item" class:active={index === currentSlideIndex}>
				<img src={item.imageUrl} alt={item.title} />
				<div class="content__wrap">
					<div class="content">
						<h2>{item.title}</h2>
						<p>{item.description}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<div class="thumbnail">
		{#each items as item, index (item.id)}
			<button
				type="button"
				class="item"
				class:active={index === currentSlideIndex}
				aria-label={`Go to slide ${index + 1}`}
				onclick={() => (currentSlideIndex = index)}
			>
				<img src={item.thumbUrl} alt={item.title} />
				<!-- Use a unique key -->

				<!-- Use Svelte transitions/animations or conditional classes based on currentSlideIndex -->
				<p class="title">{item.title}</p>
			</button>
		{/each}
	</div>

	<div class="arrows">
		<button onclick={prev} aria-label="Previous slide">...</button>
		<button onclick={next} aria-label="Next slide">...</button>
	</div>
	<!-- ... -->
</div>

<style>
	/* Carousel styles */
	:root {
		--header-height: 50px;
		--thumb-width: 180px;
		--thumb-height: 240px;
		--thumb-anim-time: 0.6s;
		--anim-move: 16px;
		--blur: 8px;
		--arrow-size: 48px;
		--bg-color: #00000040;
	}
	.carousel {
		position: relative;
		overflow: hidden;
		width: 100%;
		height: 1000px;
		border-radius: 0.5rem;
		/* margin-top: calc(var(--header-height) * -1); */
	}

	.carousel .list .item {
		position: absolute;
		width: 100%;
		height: 100%;
		inset: 0 0 0 0;
	}

	.carousel .list .item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Content styles */
	.content__wrap {
		position: absolute;
		top: 24%;
		left: 50%;
		transform: translateX(-50%);
		width: 1140px;
		max-width: 80%;
		height: 100%;
	}

	.carousel .list .item .content__wrap .content {
		position: relative;
		border-radius: 0.5rem;
		max-width: 64ch;
		font-size: 16px;
		color: #fff;
		text-shadow: 0 5px 10px var(--bg-color);
		padding: 1.6rem;
	}

	.carousel .list .item .content__wrap .content::after {
		content: '';
		position: absolute;
		inset: 0 0 0 0;
		border-radius: 0.5rem;
		background-color: var(--bg-color);
		backdrop-filter: blur(var(--blur));
		-webkit-backdrop-filter: blur(var(--blur));
		z-index: -1;
		animation: showBackdrop var(--thumb-anim-time) ease-in forwards;
	}

	/* .carousel .list .item .tag {
		font-weight: 500;
		letter-spacing: 0.25rem;
		text-transform: uppercase;
	} */

	/* .carousel .list .item .title,
	.carousel .list .item .topic {
		font-size: 3em;
		font-weight: 900;
		line-height: 1.2em;
		letter-spacing: 0.15rem;
	} */
	/* .carousel .list .item .des {
		margin-bottom: 3rem;
	} */
	/* .carousel .list .item .topic {
		color: #f1683a;
	} */

	/* Button styles */
	/* .carousel .list .item .buttons {
		display: grid;
		grid-template-columns: repeat(2, 130px);
		grid-template-rows: 40px;
		gap: 5px;
		margin-top: 20px;
	} */

	/* .carousel .list .item .buttons button {
		font-family: Poppins, sans-serif;
		text-transform: uppercase;
		font-weight: 500;
		letter-spacing: 0.25rem;
		background-color: #eee;
		border: none;
	} */

	/* Thumbnail styles */
	.thumbnail {
		position: absolute;
		display: flex;
		bottom: 50px;
		left: 50%;
		width: max-content;
		z-index: 100;
		gap: 16px;
		& .item {
			position: relative;
			width: var(--thumb-width);
			height: var(--thumb-height);
			flex-shrink: 0;
			cursor: pointer;
			border: none;
			background-color: transparent;
			& img {
				border: 2px solid var(--clr-accent-dark);
				width: 100%;
				height: 100%;
				object-fit: cover;
				border-radius: 0.5rem;
			}
			& .title {
				position: absolute;
				bottom: 1rem;
				left: 1rem;
				font-size: 0.75rem;
				font-weight: 400;
				color: #fff;
				margin-top: 0.5rem;
				letter-spacing: 0.15rem;
				background-color: var(--bg-color);
				padding: 0.25rem 0.75rem;
				border-radius: 100px;
				text-align: center;
			}
		}
	}

	/* Arrow styles */
	.arrows {
		position: absolute;
		top: 80%;
		right: 52%;
		z-index: 100;
		width: 300px;
		max-width: 30%;
		display: flex;
		gap: 10px;
		align-items: center;
	}

	.arrows button {
		display: flex;
		justify-content: center;
		align-items: center;
		width: var(--arrow-size);
		height: var(--arrow-size);
		border-radius: 0.25rem;
		background-color: #4c4656;
		border: none;
		color: #fff;
		font-family: monospace;
		font-weight: bold;
		transition: 0.5s;
	}

	/* .arrows button svg {
		width: calc(var(--arrow-size) * 0.75);
		height: calc(var(--arrow-size) * 0.75);
		z-index: auto;
	} */

	.arrows button:hover {
		background-color: #fff;
		color: #000;
	}

	/* Animation styles */

	.carousel .list .item:nth-child(1) {
		z-index: 1;
	}

	.carousel .list .item:nth-child(1) .content__wrap .content {
		opacity: 0;
		background-color: transparent;
		filter: blur(16px);
		transform: translateY(var(--anim-move));
		animation: showContent 1s ease-in 1s forwards;
	}

	.carousel.next .list .item:nth-child(1) img {
		position: absolute;
		bottom: 50px;
		left: 50%;
		width: var(--thumb-width);
		height: var(--thumb-height);
		animation: showImage var(--thumb-anim-time) ease-in forwards;
	}

	.carousel.next .thumbnail .item:nth-last-child(1) {
		overflow: hidden;
		animation: showThumbnail var(--thumb-anim-time) ease-out forwards;
	}
	/* ADDED */
	.carousel.next .list .item:nth-child(1) img {
		animation: showImage var(--thumb-anim-time) ease-in forwards;
	}

	.carousel.prev .list .item img {
		z-index: 100;
	}

	.carousel.next .thumbnail {
		animation: effectNext 0.65s ease-out forwards;
	}

	.carousel .time {
		position: absolute;
		z-index: 1000;
		width: 0%;
		height: 10px;
		background-color: #f1683a;
		left: 0;
		top: 0;
	}

	.carousel.next .time,
	.carousel.prev .time {
		animation: runningTime 3s linear forwards;
	}

	.carousel.prev .list .item:nth-child(2) {
		z-index: 2;
		animation: showBackdrop var(--thumb-anim-time) linear forwards;
		& img {
			animation: outFrame var(--thumb-anim-time) linear forwards;
			position: absolute;
			bottom: 0;
			left: 0;
		}
	}

	.carousel.prev .thumbnail .item:nth-child(1) {
		overflow: hidden;
		opacity: 0;
		animation: showThumbnail var(--thumb-anim-time) ease-in forwards;
	}

	.carousel.prev .list .item .content__wrap .content::after {
		content: '';
		position: absolute;
		inset: 0 0 0 0;
		border-radius: 0.5rem;
		background-color: var(--bg-color);
		backdrop-filter: blur(var(--blur));
		-webkit-backdrop-filter: blur(var(--blur));
	}

	.carousel.next .arrows button,
	.carousel.prev .arrows button {
		pointer-events: none;
	}

	.carousel.prev .list .item:nth-child(2) .content__wrap .content {
		animation: hideContent 0.4s linear forwards;
	}

	/* Keyframes */
	@keyframes showContent {
		to {
			transform: translateY(0px);
			opacity: 1;
			filter: blur(0px);
		}
	}

	@keyframes showBackdrop {
		to {
			inset: 0 0 0 0;
		}
	}
	@keyframes showImage {
		to {
			width: var(--thumb-width);
			height: var(--thumb-height);
			bottom: 50px;
			left: 50%;
			border-radius: 0.25rem;
		}
	}
	@keyframes showThumbnail {
		from {
			width: 0;
			opacity: 0;
		}
	}

	@keyframes effectNext {
		from {
			transform: translateX(var(--thumb-width));
		}
	}

	@keyframes runningTime {
		from {
			width: 100%;
		}
		to {
			width: 0;
		}
	}

	@keyframes outFrame {
		to {
			width: var(--thumb-width);
			height: var(--thumb-height);
			bottom: 50px;
			left: 50%;
			border-radius: 0.25rem;
		}
	}

	@keyframes hideContent {
		to {
			transform: translateY(var(--anim-move) * -1);
			opacity: 0;
			filter: blur(16px);
		}
	}

	/* Responsive styles */
	@media screen and (max-width: 960px) {
		.carousel .list .item .content {
			padding-right: 20%;
		}
	}

	@media screen and (max-width: 678px) {
		.carousel .list .item img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
		.content__wrap {
			top: 10%;
		}
		.carousel .list .item .content .title {
			font-size: 2rem;
		}
	}

	@media screen and (max-width: 480px) {
		/* Add specific styles for smaller screens if needed */
	}
</style>

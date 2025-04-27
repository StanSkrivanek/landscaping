<script lang="ts">
	// import { page } from '$app/stores';
	// import { getTilesg } from '$lib/api/tiles';

	let items = [];

	let carouselContainer = $state<HTMLElement | null>(null);
	let slidesList = $state<HTMLElement | null>(null);
	let thumbnailContainer = $state<HTMLElement | null>(null);
	let nextBtn = $state<HTMLButtonElement | null>(null);
	let prevBtn = $state<HTMLButtonElement | null>(null);

	let timeRunning = 3000;
	let timeAutoNext = 7000;
	let animationDelay = 50;

	let runTimeOut = $state<ReturnType<typeof setTimeout> | undefined>();
	let runNextAuto = $state<ReturnType<typeof setTimeout> | undefined>();

	// Use $effect to run after mount
	$effect(() => {
		// Initial setup: Move first thumbnail to end for correct initial state
		const initialThumbnailItems = thumbnailContainer?.querySelectorAll('.item');
		if (initialThumbnailItems && initialThumbnailItems.length > 0 && thumbnailContainer) {
			thumbnailContainer.appendChild(initialThumbnailItems[0]);
		}

		// Setup auto-next
		runNextAuto = setTimeout(() => {
			nextBtn?.click();
		}, timeAutoNext);
	});

	function showSlider(type: string) {
		const SliderItemsDom = slidesList?.querySelectorAll('.carousel .list .item');
		const thumbnailItems = thumbnailContainer?.querySelectorAll('.carousel .thumbnail .item');

		if (
			!SliderItemsDom ||
			SliderItemsDom.length === 0 ||
			!thumbnailItems ||
			thumbnailItems.length === 0 ||
			!slidesList ||
			!thumbnailContainer ||
			!carouselContainer
		) {
			console.error('Carousel elements not found, cannot transition.');
			return;
		}

		if (carouselContainer) {
			carouselContainer.classList.remove('next', 'prev');
		}
		clearTimeout(runTimeOut);

		if (carouselContainer) {
			carouselContainer.classList.remove('next', 'prev');
		}

		if (type === 'next') {
			slidesList.appendChild(SliderItemsDom[0]);
			thumbnailContainer.appendChild(thumbnailItems[0]);
			void carouselContainer.offsetWidth;
			setTimeout(() => {
				if (carouselContainer) {
					carouselContainer.classList.add('next');
				}
			}, animationDelay);
		} else {
			slidesList.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
			thumbnailContainer.prepend(thumbnailItems[thumbnailItems.length - 1]);
			void carouselContainer.offsetWidth;
			setTimeout(() => {
				if (carouselContainer) {
					carouselContainer.classList.add('prev');
				}
			}, animationDelay);
		}

		runTimeOut = setTimeout(() => {
			carouselContainer.classList.remove('next', 'prev');
		}, timeRunning + animationDelay);

		clearTimeout(runNextAuto);
		runNextAuto = setTimeout(() => {
			nextBtn?.click();
		}, timeAutoNext);
	}
</script>

<div class="carousel" bind:this={carouselContainer}>
	<!-- list item -->
	<div class="list" bind:this={slidesList}>
		<div class="item">
			<img
				src="https://cdn.sanity.io/images/lbo1agd3/production/1816dd630f6ef5c83067daeffa1c65915ec7901a-1440x800.webp"
				alt="AI Engines"
			/>
			<div class="content__wrap">
				<div class="content">
					<p class="tag">AI Engines</p>
					<p class="title">CHAT GPT</p>
					<!-- <p class="topic">MOOSE</p> -->
					<p class="des">
						Known for generating coherent and contextually rich text, GPT excels at language-based
						tasks like conversational responses, summarization, and creative writing. Its ability to
						understand and generate human-like text makes it an essential tool for various natural
						language processing applications.
					</p>
					<div class="buttons">
						<button>learn more</button>
					</div>
				</div>
			</div>
		</div>
		<div class="item">
			<img
				src="https://cdn.sanity.io/images/lbo1agd3/production/e2083e991bd66ee6ac1dcce5ce6649ac7cccafed-1440x961.webp"
				alt="AI Engines"
			/>
			<div class="content__wrap">
				<div class="content">
					<div class="author">AI Engines</div>
					<div class="title">MIDJOURNEY</div>
					<!-- <div class="topic">BIRD</div> -->
					<div class="des">
						Famous for producing stunning, highly detailed artistic images, MidJourney transforms
						text prompts into captivating visuals with a painterly aesthetic. Its unique approach
						results in artwork that often feels dreamlike, blending realism with imaginative
						flourishes.
					</div>
					<div class="buttons">
						<button>learn more</button>
						<!-- <button>SUBSCRIBE</button> -->
					</div>
				</div>
			</div>
		</div>
		<div class="item">
			<img
				src="https://cdn.sanity.io/images/lbo1agd3/production/1816dd630f6ef5c83067daeffa1c65915ec7901a-1440x800.webp"
				alt="AI Engines"
			/>
			<div class="content__wrap">
				<div class="content">
					<div class="author">AI Engines</div>
					<div class="title">DALL-E</div>
					<!-- <div class="topic">BIRD</div> -->
					<div class="des">
						DALL·E stands out for its ability to generate whimsical and surreal visuals,
						transforming text descriptions into images that are often surprising and creative. Its
						strength lies in combining outlandish elements into coherent, visually striking
						compositions.
					</div>
					<div class="buttons">
						<button>learn more</button>
						<!-- <button>SUBSCRIBE</button> -->
					</div>
				</div>
			</div>
		</div>
		<div class="item">
			<img
				src="https://cdn.sanity.io/images/lbo1agd3/production/e2083e991bd66ee6ac1dcce5ce6649ac7cccafed-1440x961.webp"
				alt="AI Engines"
			/>
			<div class="content__wrap">
				<div class="content">
					<div class="author">AI Engines</div>
					<div class="title">STABLE DIFUSION</div>
					<!-- <div class="topic">ELEPHANT</div> -->
					<div class="des">
						Specializing in creating photorealistic images, Stable Diffusion excels at producing
						sharp, high-resolution visuals that look impressively lifelike. It also offers the
						ability to modify and fine-tune existing images, making it a powerful tool for detailed
						visual creation.
					</div>
					<div class="buttons">
						<button>learn more</button>
						<!-- <button>SUBSCRIBE</button> -->
					</div>
				</div>
			</div>
		</div>
		<div class="item">
			<img
				src="https://cdn.sanity.io/images/lbo1agd3/production/1816dd630f6ef5c83067daeffa1c65915ec7901a-1440x800.webp"
				alt="AI Engines"
			/>
			<div class="content__wrap">
				<div class="content">
					<div class="author">AI Engines</div>
					<div class="title">RUNWAY ML</div>
					<!-- <div class="topic">CHEETAH</div> -->
					<div class="des">
						Runway ML provides cutting-edge tools for generating and editing video and animated
						content, making it ideal for multimedia creators. Its integration of AI into the video
						production process opens up new possibilities for creative storytelling and visual
						effects.
					</div>
					<div class="buttons">
						<button>learn more</button>
						<!-- <button>SUBSCRIBE</button> -->
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- list thumbnail -->
	<div class="thumbnail" bind:this={thumbnailContainer}>
		<div class="item">
			<img
				src="https://cdn.sanity.io/images/lbo1agd3/production/1816dd630f6ef5c83067daeffa1c65915ec7901a-1440x800.webp"
				alt="AI Engines"
			/>
			<div class="content">
				<div class="title">CHAT-GPT</div>
			</div>
		</div>
		<div class="item">
			<img
				src="https://cdn.sanity.io/images/lbo1agd3/production/e2083e991bd66ee6ac1dcce5ce6649ac7cccafed-1440x961.webp"
				alt="AI Engines"
			/>
			<div class="content">
				<div class="title">MIDJOURNEY</div>
			</div>
		</div>
		<div class="item">
			<img
				src="https://cdn.sanity.io/images/lbo1agd3/production/1816dd630f6ef5c83067daeffa1c65915ec7901a-1440x800.webp"
				alt="AI Engines"
			/>
			<div class="content">
				<div class="title">DALL-E</div>
			</div>
		</div>
		<div class="item">
			<img
				src="https://cdn.sanity.io/images/lbo1agd3/production/e2083e991bd66ee6ac1dcce5ce6649ac7cccafed-1440x961.webp"
				alt="AI Engines"
			/>
			<div class="content">
				<div class="title">STABLE DIFUSION</div>
			</div>
		</div>
		<div class="item">
			<img
				src="https://cdn.sanity.io/images/lbo1agd3/production/1816dd630f6ef5c83067daeffa1c65915ec7901a-1440x800.webp"
				alt="AI Engines"
			/>
			<div class="content">
				<div class="title">RUNWAY ML</div>
			</div>
		</div>
	</div>
	<!-- next prev -->

	<div class="arrows">
		<button bind:this={prevBtn} aria-label="Previous slide" onclick={() => showSlider('prev')}>
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
		<button bind:this={nextBtn} aria-label="Next slide" onclick={() => showSlider('next')}>
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
	<!-- time running -->
	<div class="time"></div>
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
		margin-top: calc(var(--header-height) * -1);
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

	.carousel .list .item .tag {
		font-weight: 500;
		letter-spacing: 0.25rem;
		text-transform: uppercase;
	}

	/* .carousel .list .item .topic */
	.carousel .list .item .title {
		font-size: 3em;
		font-weight: 900;
		line-height: 1.2em;
		letter-spacing: 0.15rem;
	}
	.carousel .list .item .des {
		margin-bottom: 3rem;
	}
	/* .carousel .list .item .topic {
		color: #f1683a;
	} */

	/* Button styles */
	.carousel .list .item .buttons {
		display: grid;
		grid-template-columns: repeat(2, 130px);
		grid-template-rows: 40px;
		gap: 5px;
		margin-top: 20px;
	}

	.carousel .list .item .buttons button {
		font-family: Poppins, sans-serif;
		text-transform: uppercase;
		font-weight: 500;
		letter-spacing: 0.25rem;
		background-color: #eee;
		border: none;
	}

	/* Thumbnail styles */
	.thumbnail {
		display: flex;
		position: absolute;
		bottom: 50px;
		left: 50%;
		width: max-content;
		z-index: 100;
		gap: 16px;
	}

	.thumbnail .item {
		position: relative;
		width: var(--thumb-width);
		height: var(--thumb-height);
		flex-shrink: 0;
	}

	.thumbnail .item .title {
		letter-spacing: 0.15rem;
		background-color: var(--bg-color);
		padding: 0.25rem 0.75rem;
		border-radius: 100px;
		text-align: center;
	}

	.thumbnail .item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 0.5rem;
	}

	.thumbnail .item .content {
		color: #fff;
		position: absolute;
		bottom: 1rem;
		left: 1rem;
	}

	.thumbnail .item .content .title {
		font-weight: 400;
		font-size: 0.75rem;
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

	.arrows button svg {
		width: calc(var(--arrow-size) * 0.75);
		height: calc(var(--arrow-size) * 0.75);
		z-index: auto;
	}

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
		/* Delay animation slightly to sync better with image */
		/* The delay here is relative to when the element becomes visible/applicable */
		animation: showContent 0.8s ease-in 0.7s forwards;
	}

	/* Ensure the image being animated is targeted correctly */
	/* Add a small delay using animation-delay (e.g., 0.1s) */
	.carousel .next .list .item:nth-child(2) img {
		/* Target the *second* item's img when 'next' is applied, as the first one was moved */
		position: absolute;
		bottom: 50px; /* Start position for animation */
		left: 50%;
		width: var(--thumb-width); /* Start size */
		height: var(--thumb-height);
		border-radius: 0.25rem;
		object-fit: cover; /* Ensure object-fit is applied */
		/* Add animation-delay here */
		animation: showImage var(--thumb-anim-time) ease-in forwards;
		/* animation-delay: 0.1s; */ /* Alternative: Add delay via JS setTimeout */
		z-index: 2; /* Ensure it's above the main image */
	}

	/* Add animation-delay here */
	.carousel .next .thumbnail .item:nth-last-child(1) {
		overflow: hidden;
		animation: showThumbnail var(--thumb-anim-time) ease-out forwards;
		/* animation-delay: 0.1s; */ /* Alternative: Add delay via JS setTimeout */
	}
	/* REMOVED duplicate/conflicting rule */
	/* .carousel.next .list .item:nth-child(1) img {
		animation: showImage var(--thumb-anim-time) ease-in forwards;
	} */

	.carousel.prev .list .item img {
		z-index: 100;
	}

	/* Add animation-delay here */
	.carousel .next .thumbnail {
		/* Ensure this transform doesn't conflict if already positioned with left: 50% */
		/* Consider removing if left: 50% and width: max-content handles positioning */
		animation: effectNext 0.65s ease-out forwards;
		/* animation-delay: 0.1s; */ /* Alternative: Add delay via JS setTimeout */
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

	/* Add animation-delay here */
	.carousel .next .time,
	.carousel .prev .time {
		animation: runningTime 3s linear forwards;
		/* animation-delay: 0.1s; */ /* Alternative: Add delay via JS setTimeout */
	}

	/* Target the correct item for the 'prev' image animation */
	/* Add animation-delay here */
	.carousel .prev .list .item:nth-child(1) img {
		/* Target the *first* item's img when 'prev' is applied */
		z-index: 2; /* Ensure it's visible */
		animation: outFrame var(--thumb-anim-time) linear forwards;
		/* animation-delay: 0.1s; */ /* Alternative: Add delay via JS setTimeout */
	}
	/* REMOVED redundant rule block for .carousel.prev .list .item:nth-child(2) */

	/* Add animation-delay here */
	.carousel .prev .thumbnail .item:nth-child(1) {
		overflow: hidden;
		opacity: 0; /* Start hidden for animation */
		animation: showThumbnail var(--thumb-anim-time) ease-in forwards;
		/* animation-delay: 0.1s; */ /* Alternative: Add delay via JS setTimeout */
	}

	/* Ensure backdrop applies correctly during prev transition */
	.carousel .prev .list .item:nth-child(2) .content__wrap .content::after {
		/* Target second item's content */
		content: '';
		position: absolute;
		inset: 0 0 0 0;
		border-radius: 0.5rem;
		background-color: var(--bg-color);
		backdrop-filter: blur(var(--blur));
		-webkit-backdrop-filter: blur(var(--blur));
		/* animation: showBackdrop var(--thumb-anim-time) linear forwards; */ /* Might not be needed if content hides */
	}

	.carousel .next .arrows button,
	.carousel .prev .arrows button {
		pointer-events: none;
	}

	/* Add animation-delay here */
	.carousel .prev .list .item:nth-child(2) .content__wrap .content {
		/* Target second item's content */
		animation: hideContent 0.4s linear forwards;
		/* animation-delay: 0.1s; */ /* Alternative: Add delay via JS setTimeout */
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
		/* Animation starts implicitly from the element's current state */
		/* The target state is the thumbnail position/size */
		to {
			width: var(--thumb-width);
			height: var(--thumb-height);
			bottom: 50px; /* Final position matching thumbnail container bottom */
			left: calc(
				50% + var(--thumb-width) * 2.5 + 16px * 2
			); /* Approximate final position in thumbnail list */
			border-radius: 0.5rem; /* Match thumbnail radius */
		}
	}
	@keyframes showThumbnail {
		from {
			width: 0;
			opacity: 0;
		}
		to {
			/* Explicitly define end state */
			width: var(--thumb-width);
			opacity: 1;
		}
	}

	@keyframes effectNext {
		from {
			transform: translateX(
				calc(var(--thumb-width) + 16px)
			); /* Move by one thumbnail width + gap */
		}
		to {
			transform: translateX(0);
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
		/* Animation starts implicitly from the element's current state (full size) */
		/* The target state is the thumbnail position/size */
		to {
			width: var(--thumb-width);
			height: var(--thumb-height);
			bottom: 50px; /* Final position matching thumbnail container bottom */
			left: calc(
				50% - var(--thumb-width) * 1.5 - 16px
			); /* Approximate final position in thumbnail list */
			border-radius: 0.5rem; /* Match thumbnail radius */
		}
	}

	@keyframes hideContent {
		to {
			transform: translateY(calc(var(--anim-move) * -1));
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

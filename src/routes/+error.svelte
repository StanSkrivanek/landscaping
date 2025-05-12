<script lang="ts">
	import { page } from '$app/state';
	console.log('🚀 ~ERROR page:', page);
	const { status, error, url } = page;
</script>

<svelte:head>
	<title>Error | ABR Landscaping</title>
</svelte:head>

<div class="error-container">
	<div class="error-details">
		<h1 class="error-status">
			{status}
		</h1>
		<h2 class="error-title">Something went wrong</h2>

        <div class="error-message"><p>Error Message: {error?.message || 'An unexpected error occurred.'}</p></div>
		<p class="error-path">
			The page <span>{url.pathname}</span> you are looking for does not exist or may have been moved. Keep exploring our site.
		</p>
		<!-- Add home button below error message -->
		<a href="/" class="home-btn">Go to Home Page</a>
	</div>
</div>

<style>
	.error-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		min-width: 100vw;
		overflow-x: hidden;
	}
	.error-details {
		position: relative;
		/* padding: 3rem; */
	}
	.error-status {
		/* min-height: 250px;
		min-width: 430px; */
		font-size: var(--fs-xxxxxl);
		font-weight: 900;
		color: var(--clr-orange); /* daisyBush */
		margin: 0;
	}
	.error-title {
		margin-bottom: 0.25rem;
		font-size: var(--fs-xl);
		/* font-weight: 900; */
		color: var(--clr-orange);
	}
	.error-path {
		margin-bottom: 1rem;
		font-size: var(--fs-xl);
		font-family: var(--ff-regular);
		width: 24ch;
		line-height: 1.1;
		color: #0c0e34;
		span {
			color: var(--clr-orange);
		}
	}
	.error-message {
		color: #0c0e34;
        font-size: var(--fs-lg);
        margin-bottom: 1.5rem;
	}
	.home-btn {
		display: inline-block;
		margin-top: 2rem;
		padding: 0.75rem 2rem;
		background: var(--clr-accent-dark);
		color: #fff;
		border-radius: 0.5rem;
		font-size: var(--fs-l);
		font-weight: 700;
		text-decoration: none;
		transition: background 0.2s;
	}
	.home-btn:hover,
	.home-btn:focus {
		background: var(--clr-orange);
		color: #fff;
	}
</style>

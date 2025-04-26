<script>
	let drawerOpen = false;

	function openDrawer() {
		drawerOpen = true;
	}
	function closeDrawer() {
		drawerOpen = false;
	}
</script>

<div class="header">
	<div class="logo">
		<a href="/">
			<img
				src="https://cdn.sanity.io/images/lbo1agd3/production/00c6b0ec3a7febb52fdf1acac9d35376fc2226c5-368x97.svg"
				alt="Logo"
			/>
		</a>
	</div>
	<!-- <div class="nav">
		<a href="/services">Services</a>
		<a href="/projects">Projects</a>

		<a href="/contact">Contact</a>
	</div> -->
	<!-- Nav Trigger -->
	<button class="nav-trigger" onclick={openDrawer} aria-label="Open navigation">
		<span></span>
		<span></span>
		<span></span>
	</button>
</div>

<!-- Drawer Navigation -->
<button
	type="button"
	class="drawer-backdrop"
	onclick={closeDrawer}
	class:open={drawerOpen}
	aria-label="Close navigation"
	tabindex="0"
></button>
<nav class="drawer" class:open={drawerOpen} aria-hidden={!drawerOpen}>
	<button class="close-btn" onclick={closeDrawer} aria-label="Close navigation">&times;</button>
	<a href="/">Home</a>
	<a href="/services">Services</a>
	<a href="/projects">Projects</a>
	<a href="/about">About</a>
	<a href="/contact">Contact</a>
</nav>

<style>
	.header {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 10;
		display: flex;
		padding-inline: 2rem;
		padding-block: 1.4rem;
		align-items: center;
		justify-content: space-between;
		background-color: rgba(0, 0, 0, 0.35);
		pointer-events: auto;
	}

	.logo {
		width: 160px;
	}
	.nav {
		display: flex;
		gap: 2rem;
		& a {
			color: #fff;
			text-decoration: none;
			font-size: 1rem;
			font-weight: 400;
			font-family: var(--ff-org);
		}
	}
	.nav-trigger {
		background: none;
		border: none;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 40px;
		height: 40px;
		gap: 6px;
		z-index: 20;
	}
	.nav-trigger span {
		display: block;
		width: 28px;
		height: 3px;
		background: #fff;
		border-radius: 2px;
		transition: 0.3s;
	}

	.drawer-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.3);
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s;
		z-index: 15;
	}
	.drawer-backdrop.open {
		opacity: 1;
		pointer-events: auto;
	}

	.drawer {
		position: fixed;
		top: 0;
		right: 0;
		height: 100vh;
		width: 260px;
		background: #181818;
		box-shadow: -2px 0 12px rgba(0, 0, 0, 0.2);
		transform: translateX(100%);
		transition: transform 0.3s;
		z-index: 20;
		display: flex;
		flex-direction: column;
		padding: 2rem 1.5rem;
		gap: 1.5rem;
	}
	.drawer.open {
		transform: translateX(0);
	}
	.drawer a {
		color: #fff;
		text-decoration: none;
		font-size: 1.2rem;
		font-weight: 500;
		transition: color 0.2s;
	}
	.drawer a:hover {
		color: #e0e0e0;
	}
	.close-btn {
		background: none;
		border: none;
		color: #fff;
		font-size: 2rem;
		align-self: flex-end;
		cursor: pointer;
		margin-bottom: 1rem;
	}
</style>

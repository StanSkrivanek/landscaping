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
	<!-- Nav Trigger -->
	<button class="nav-trigger" onclick={openDrawer} aria-label="Open navigation">
		<span class="nav-trigger-top"></span>
		<span class="nav-trigger-bottom"></span>
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
	<!-- Custom close button using lines, matching nav-trigger style -->
	<button class="close-btn" onclick={closeDrawer} aria-label="Close navigation">
		<span class="close-btn-x">
			<span class="close-btn-top"></span>
			<span class="close-btn-bottom"></span>
		</span>
	</button>
	<a href="/" onclick={closeDrawer}><span>to</span>Home</a>
	<a href="/services" onclick={closeDrawer}><span>offered</span>Services</a>
	<a href="/projects" onclick={closeDrawer}><span>clients</span>Projects</a>
	<a href="/about" onclick={closeDrawer}><span>something</span>About Us</a>
	<a href="/contact" onclick={closeDrawer}><span>our</span>Contact</a>
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
	/* .nav {
		display: flex;
		gap: 2rem;
		& a {
			color: #fff;
			text-decoration: none;
			font-size: 1rem;
			font-weight: 400;
			font-family: var(--ff-org);
		}
	} */
	.nav-trigger {
		background: none;
		border: none;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: end;
		width: 100px;
		height: px;
		gap: 12px;
		z-index: 20;
	}
	.nav-trigger span {
		display: block;
		height: 2px;
		background: #fff;
		transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.nav-trigger-top {
		background: red;
		width: 80px;
	}
	.nav-trigger-bottom {
		transform: translateY(0);
		width: 60px;
	}

	/* Animation on hover */
	.nav-trigger:hover .nav-trigger-top {
		width: 100px;
	}
	.nav-trigger:hover .nav-trigger-bottom {
		width: 40px;
		justify-content: left;
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
		/* Responsive width: 100vw on small screens, 600px on desktop */
		width: 100vw;
		max-width: 600px;
		background: var(--clr-bg);
		box-shadow: -2px 0 12px rgba(0, 0, 0, 0.2);
		transform: translateX(100%);
		transition: transform 0.3s;
		z-index: 20;
		display: flex;
		flex-direction: column;
		padding: 2rem 3rem;
		gap: 1.5rem;
		& a {
			position: relative;
			color: var(--clr-accent-dark);
			text-decoration: none;
			transition: color 0.2s;
			margin: 0.5rem 0;
			font-family: var(--ff-org);
			font-size: var(--fs-xxxl);
			/* Add extra right padding so span is never cut off */
			padding-right: 2.5em;
			/* Change link color on hover */
			&:hover,
			&:active,
			&:focus {
				color: var(--clr-accent);
			}
			& span {
				position: absolute;
				top: -8px;
				left: 0;
				width: 100%;
				pointer-events: none;
				color: var(--clr-accent-dark);
				font-size: var(--fs-xl);
				font-family: var(--ff-thin);
				font-style: italic;
				z-index: -1;
				opacity: 0;
				will-change: transform, opacity;
				transition:
					transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
					color 0.2s,
					opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				transform: translateY(0);
			}
			/* Change span color, opacity, and position on link hover */
			&:hover span,
			&:active span,
			&:focus span {
				color: var(--clr-orange);
				transform: translateY(-8px);
				opacity: 0.3;
			}
		}
	}
	.drawer.open {
		transform: translateX(0);
	}

	.close-btn {
		background: none;
		border: none;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 60px;
		height: 60px;
		z-index: 20;
		margin-bottom: 0.5rem;
		align-self: flex-end;
		position: relative;
	}
	.close-btn-x {
		position: relative;
		display: flex;
		width: 60px;
		height: 24px;
		align-items: center;
	}
	.close-btn-top,
	.close-btn-bottom {
		position: absolute;
		left: 50%;
		width: 40px;
		height: 2px;
		background: var(--clr-accent-dark);
		transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.close-btn-top {
		transform: translateX(-50%) rotate(45deg);
	}
	.close-btn-bottom {
		transform: translateX(-50%) rotate(-45deg);
	}
	.close-btn:hover .close-btn-top,
	.close-btn:hover .close-btn-bottom {
		width: 60px;
	}
	@media (width > 600px) {
		.drawer {
			width: 600px;
		}
	}
</style>

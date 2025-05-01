<script lang="ts">
	import Facebook from './icons/Facebook.svelte';
	import Instagram from './icons/Instagram.svelte';
	const currentYear = new Date().getFullYear();
	// Some footer magic
</script>

<footer class="section-grid">
	<div class="content__c">
		<div class="part">
			<div class="logo">
				<a href="/">
					<img
						src="https://cdn.sanity.io/images/lbo1agd3/production/643bf99e2bf633a8ee3567dffcc06a1386845f96-200x74.svg"
						alt="Logo"
					/>
				</a>
			</div>
			<div>
				<p>
					<a href="mailto:example@example.com">info@abrlandscaping.com</a>
				</p>
				<p>
					<a href="tel:+123456789">+353 86 896 6575</a>
				</p>
			</div>
			<div class="social">
				<a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
					<Instagram width={32} height={32} />
				</a>
				<a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
					<Facebook width={32} height={32} />
				</a>
			</div>
		</div>
		<div class="parts">
			<div class="part">
				<h3>pages</h3>
				<div>
					<ul>
						<li><a href="/about">About</a></li>
						<li><a href="/services">Services</a></li>
						<li><a href="/projects">Projects</a></li>
						<li><a href="/contact">Contact</a></li>
					</ul>
				</div>
			</div>
			<div class="part">
				<h3>terms</h3>
				<div>
					<ul>
						<li><a href="/terms">Terms of Service</a></li>
						<li><a href="/privacy">Privacy Policy</a></li>
						<li><a href="/cookies">Cookie Policy</a></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<div class="sub-footer">
		<p>&copy; {currentYear} ABR Landscaping. All rights reserved.</p>
		<p>Created by <a href="https://stan-skrivanek.vercel.app">Finediv Studio</a></p>
	</div>
</footer>

<style>
	.section-grid {
		padding-top: 3rem;
	}
	footer {
		border-top: 1px solid #e5e7eb;
		color: var(--color-text);
		text-align: center;
		margin-block: 0;
		/* background: var(--clr-accent); */
	}
	.content__c {
		grid-column: 3/-3;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		text-align: left;
		padding-block: 2rem;
		background: var(--clr-bg);
		gap: 2rem; /* Add gap for horizontal spacing */
		container-type: inline-size;
		@media (max-width: 768px) {
			flex-direction: column;
			padding-block: 3rem;
			gap: 3rem; /* Adjust gap for vertical spacing */
		}
		& h3 {
			font-size: var(--fs-sm);
			margin-bottom: 1rem;
			grid-column: 2/-2;
			text-transform: uppercase; /* Added for consistency */
			font-weight: 600; /* Added for emphasis */
		}
		& ul {
			list-style: none;
			padding: 0;
			display: flex;
			flex-direction: column;
			gap: 0.5rem; /* Add spacing between list items */
			/* & li:before{
				content: '';
				display: inline-block;
				width: 12px;
				height: 1px;
				margin: 0 0.5rem;
				background: var(--clr-orange);
				transition: width 0.2s ease;
			} */
		}
		& a {
			text-decoration: none;
			color: var(--color-text);
			transition: color 0.2s ease;
		
			&:hover {
				color: var(--clr-orange);
			}
		}
	}
	.parts {
		display: flex;
		flex-direction: row;
		gap: 10rem; /* Add gap for horizontal spacing */
		/* flex-basis: 50%; */
		justify-content: space-evenly;
		@media (max-width: 768px) {
			flex-direction: column;
			gap: 3rem; /* Adjust gap for vertical spacing */
		}
	}
	.logo {
		margin-bottom: 2rem;
		& img {
			width: 100%;
			max-width: 120px;
			height: auto;
			@media (max-width: 768px) {
				max-width: 100px; /* Adjust logo size for smaller screens */
			}
		}
	}
	.social {
		display: flex;
		gap: 0.5rem; /* Add spacing between social icons */
		margin-top: 1rem;
	}
	.sub-footer {
		grid-column: 3/-3;
		font-size: var(--fs-xxs);
		display: flex; /* Use flexbox for alignment */
		justify-content: space-between; /* Space out items */
		flex-wrap: wrap; /* Allow wrapping on small screens */
		gap: 0.5rem; /* Add gap between items */
		padding-block: 1rem; /* Add some space above */
		/* border-top: 1px solid #e5e7eb; Add separator line */
		/* margin-top: 2rem; Add space above the sub-footer */
		@media (max-width: 768px) {
			grid-column: 3/-3; /* Adjust grid column for smaller screens */
			justify-content: center; /* Center items on smaller screens */
			text-align: center;
			margin-top: 2rem;
		}
		& a {
			color: var(--clr-orange);
		}
	}
</style>

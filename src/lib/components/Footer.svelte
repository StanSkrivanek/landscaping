<script lang="ts">
	import Facebook from './icons/Facebook.svelte';
	import Instagram from './icons/Instagram.svelte';

	const currentYear = new Date().getFullYear();
	// Some footer magic
</script>

<footer class="section-grid">
	<div class="content__c">
		<div class="company-info">
			<img src="/svg/abr-logo-txt-orange.svg" alt="ABR Landscaping logo" />

			<div>
				<p>
					<a href="mailto:example@example.com">info@abrlandscaping.com</a>
				</p>
				<p>
					<a href="tel:+123456789">+353 86 896 6575</a>
				</p>
			</div>
			<div class="social">
				<a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer nofollow">
					<Instagram width={48} height={48} />
				</a>
				<a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer nofollow">
					<Facebook width={48} height={48} />
				</a>
			</div>
		</div>
		<div class="footer-nav">
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
		<p>
			Design &amp; Development: <a
				href="https://stan-skrivanek.vercel.app"
				target="_blank"
				rel="noopener">Finediv Studio</a
			>
		</p>
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
		/* background: var(--clr-accent-light); */
	}
	.content__c {
		grid-column: 2/-2;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		text-align: left;
		padding-block: 2rem;
		/* background: var(--clr-bg); */
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
	.footer-nav {
		display: flex;
		flex-direction: row;
		gap: calc(4rem + 1vw); /* Add gap for horizontal spacing */
		/* flex-basis: 50%; */
		justify-content: space-evenly;
		align-items: flex-start;
	}
	.company-info {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		& img {
			width: 300px;
		}
		@media (width < 768px) {
			align-items: center;
			text-align: center;
			& img {
				width: 75%;
			}
		}
	}

	.social {
		display: flex;
		gap: 0.5rem; /* Add spacing between social icons */
		margin-top: 1rem;
	}
	.sub-footer {
		grid-column: 2/-2;
		font-size: 14px;
		display: flex; /* Use flexbox for alignment */
		justify-content: space-between; /* Space out items */
		flex-wrap: wrap; /* Allow wrapping on small screens */
		gap: 0.5rem; /* Add gap between items */
		padding-block: 1rem; /* Add some space above */
		/* border-top: 1px solid #e5e7eb; Add separator line */
		/* margin-top: 2rem; Add space above the sub-footer */
		@media (width < 1024px) {
			grid-column: 1/-1; /* Adjust grid column for smaller screens */
			justify-content: center; /* Center items on smaller screens */
			text-align: center;
			margin-top: 1rem;
		}
		& a {
			color: var(--clr-orange);
		}
		@media (width < 480px) {
			grid-column: 1/-1;
			font-size: 12px;
		}
	}

	@media (width < 768px) {
		.section-grid {
			padding-top: 2rem;
		}
		.content__c {
			grid-column: 2/-2;
		}
	}
</style>

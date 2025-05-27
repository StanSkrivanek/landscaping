<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
    import { PortableText } from '@portabletext/svelte';
    import CustomHeading from '$lib/components/portableText/CustomHeading.svelte';
	import CustomParagraph from '$lib/components/portableText/CustomParagraph.svelte';
	import Footer from '$lib/components/Footer.svelte';
    const { data } = $props()
    console.log("🚀 ~ data:", data)
    const lastUpdated = new Date(data.pageContent.updatedAt);
    const portableText = data.pageContent.content; // Assuming 'content' is the field containing the Portable Text content
    // console.log("🚀 ~ portableText:", portableText)
</script>

<Seo
	title="Terms of Use"
	description="Landscaping services in Cork county that nurture heart, soul, and mind."
    siteName="ABR Landscaping"
/>
<main>
    <section>
        <article class="container">
            <div class="header">
                <h1 class="header-title">Privacy Policy</h1>
                <p class="header-subtitle">Last Updated: {lastUpdated.toLocaleDateString()}</p>
            </div>
            <!-- only month-day-year -->
			<PortableText
				value={portableText}
				onMissingComponent={false}
				components={{
					block: {
						h1: CustomHeading,
						h2: CustomHeading,
						h3: CustomHeading,
						normal: CustomParagraph
					},
					types: {
						block: CustomParagraph
					}
				}}
			/>
		</article>
    </section>
</main>
<Footer />
<style>
    .header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .header-title {
        font-size: var(--fs-xxxl);
        margin-bottom: 0.5rem;
    }

    .header-subtitle {
        font-size: var(--fs-xxs);
        color: #666;
    }
    .container {
        max-width: 1100px;
        margin: 100px auto;
        padding: 1rem;
    }   
    /* @media (max-width: 600px) {
        .header-title {
            font-size: 2rem;
        }
        .header-subtitle {
            font-size: 1rem;
        }
    }
    @media (min-width: 601px) and (max-width: 900px) {
        .header-title {
            font-size: 2.25rem;
        }
        .header-subtitle {
            font-size: 1.1rem;
        }
    }
    @media (min-width: 901px) {
        .header-title {
            font-size: 2.5rem;
        }
        .header-subtitle {
            font-size: 1.2rem;
        }
    }
    @media (min-width: 1200px) {
        .header-title {
            font-size: 2.75rem;
        }
        .header-subtitle {
            font-size: 1.3rem;
        }
    }
    @media (min-width: 1600px) {
        .header-title {
            font-size: 3rem;
        }
        .header-subtitle {
            font-size: 1.4rem;
        }
    }
    @media (min-width: 2000px) {
        .header-title {
            font-size: 3.25rem;
        }
        .header-subtitle {
            font-size: 1.5rem;
        }
    }
    @media (min-width: 2400px) {
        .header-title {
            font-size: 3.5rem;
        }
        .header-subtitle {
            font-size: 1.6rem;
        }
    } */
    </style>
<script>
    /**
     * @typedef {Object} NavItem
     * @property {string} slug - The slug for the link.
     * @property {string} title - The title to display.
     */

    /**
     * @type {{ prevItem?: NavItem, nextItem?: NavItem }}
     */
    let { prevItem, nextItem } = $props();

    // Base path for the links (adjust if needed)
    const basePath = '/projects';
</script>

<nav class="prev-next-nav">
    {#if prevItem}
        <a href={`${basePath}/${prevItem.slug}`} class="nav-link prev" aria-label={`Previous project: ${prevItem.title}`}>
            <span class="arrow">←</span>
            <span class="text">
                <span class="label">Previous</span>
                <span class="title">{prevItem.title}</span>
            </span>
        </a>
    {:else}
        <div class="nav-link placeholder"></div> <!-- Placeholder for alignment -->
    {/if}

    {#if nextItem}
        <a href={`${basePath}/${nextItem.slug}`} class="nav-link next" aria-label={`Next project: ${nextItem.title}`}>
            <span class="text">
                <span class="label">Next</span>
                <span class="title">{nextItem.title}</span>
            </span>
            <span class="arrow">→</span>
        </a>
    {:else}
        <div class="nav-link placeholder"></div> <!-- Placeholder for alignment -->
    {/if}
</nav>

<style>
    .prev-next-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 2rem 0;
        border-top: 1px solid var(--clr-border, #eee); /* Add a separator */
        margin-top: 2rem;
    }

    .nav-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        text-decoration: none;
        color: var(--clr-text, #333);
        transition: color 0.2s ease;
        flex: 1; /* Allow links to take up space */
        min-width: 0; /* Prevent overflow issues */
    }

    .nav-link:hover {
        color: var(--clr-accent, #007bff);
    }

    .nav-link.next {
        justify-content: flex-end;
        text-align: right;
    }
     .nav-link.prev {
        justify-content: flex-start;
        text-align: left;
    }

    .arrow {
        font-size: 1.5rem;
        line-height: 1;
    }

    .text {
        display: flex;
        flex-direction: column;
    }

    .label {
        font-size: 0.8rem;
        color: var(--clr-text-muted, #777);
        text-transform: uppercase;
        margin-bottom: 0.2rem;
    }

    .title {
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .placeholder {
        flex: 1; /* Match flex property of links */
    }

    /* Adjustments for smaller screens if needed */
    @media (width < 600px) {
        .prev-next-nav {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
        }
        .nav-link.next, .nav-link.prev {
            justify-content: space-between; /* Space out arrow and text */
            text-align: left; /* Align text left */
        }
        .nav-link.next .text {
            order: -1; /* Move text before arrow */
            text-align: right;
        }
         .placeholder {
            display: none; /* Hide placeholders on small screens */
        }
    }
</style>
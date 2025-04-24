<script lang="ts">

  import { onMount } from "svelte";

  /**
   * @type {HTMLDivElement}
   */
  let studioRoot: HTMLDivElement;

  onMount(() => {
    let unmountStudio: (() => void) | undefined;

    Promise.all([import("sanity"), import("./sanity.config")]).then(
      ([{ renderStudio }, { default: config }]) => {
        if (studioRoot) {
          // Use renderStudio instead of React's createRoot
          unmountStudio = renderStudio(studioRoot, config);
        }
      }
    );

    // Return cleanup function for when component is destroyed
    return () => {
      if (unmountStudio) unmountStudio();
    };
  });
</script>

<div bind:this="{studioRoot}" style="height: 100vh;"></div>
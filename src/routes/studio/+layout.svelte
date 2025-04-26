<script>
  import Studio from "$lib/studio/Studio.svelte"; 
  let { children } = $props();
</script>
<Studio /> 
{@render children?.()}
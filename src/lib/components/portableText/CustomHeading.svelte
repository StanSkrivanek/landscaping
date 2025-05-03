<!-- CustomHeading (blockStyle) -->
<script lang="ts">
  import type {BlockComponentProps} from '@portabletext/svelte'
	import type { Snippet } from 'svelte';

  interface Props {
    portableText: BlockComponentProps
    children: Snippet
  }

  let {portableText, children}: Props = $props()

  let {indexInParent, global, value} = $derived(portableText)
  let {ptBlocks} = $derived(global)
  let {style} = $derived(value)

  const headings = ['h1', 'h2', 'h3', 'h4', 'h5']

  let precededByHeading = $derived(
    (() => {
      const prev = ptBlocks[indexInParent - 1];
      // Check if prev is an object and has a 'style' property of type string
      return prev && typeof (prev as any).style === 'string'
        ? headings.includes((prev as any).style)
        : false;
    })()
  )

  let anchorId = $derived(`heading-${value._key}`)
</script>

<!-- If preceded by heading, have a higher margin top -->
<div class="relative {precededByHeading ? 'mt-10' : 'mt-4'}" id={anchorId}>
  <a href="#{anchorId}">
    <span class="sr-only">Link to this heading</span>
    🔗
  </a>
  {#if style === 'h1'}
    <h1 class="text-4xl font-black">
      {@render children()}
    </h1>
  {:else if style === 'h2'}
    <h2 class="text-3xl">
      {@render children()}
    </h2>
  {:else if style === 'h3'}
    <h3 class="text-xl">
      {@render children()}
    </h3>
  {:else}
    <h4 class="text-lg text-gray-600">
      {@render children()}
    </h4>
  {/if}
</div>
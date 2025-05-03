<!-- CustomHeading (blockStyle) -->
<script lang="ts">
	import type { BlockComponentProps } from '@portabletext/svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		portableText: BlockComponentProps;
		children: Snippet;
	}

	let { portableText, children }: Props = $props();

	let { indexInParent, global, value } = $derived(portableText);
	let { ptBlocks } = $derived(global);
	let { style } = $derived(value);

	console.log('🚀 ~ CustomH1Component');
</script>

{#if style === 'normal'}
	<p>{@render children()}</p>
{/if}

<!-- {#if style === 'normal'}
  <p>{value}</p>
  <pre>
    {JSON.stringify(value, 0, 2)}
  </pre>
{:else}
  {value}
{/if} -->

<style>
	p {
		margin-bottom: 1rem;
	}
</style>

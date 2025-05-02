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
</script>

{#if style === 'normal'}
	
		{@render children()}
	
{/if}

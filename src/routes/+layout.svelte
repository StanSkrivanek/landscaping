<script>
	//  with rune `$props()` we have access ot { children, data, form }
	let { children } = $props();
	import '../app.css';
</script>

<!-- render layout -->
{@render children()}
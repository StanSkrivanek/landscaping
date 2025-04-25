<script>
	//  with rune `$props()` we have access ot { children, data, form }
	let { children } = $props();
	import '../app.css';
</script>

<!-- render layout -->
<div class="container">
	{@render children()}
</div>


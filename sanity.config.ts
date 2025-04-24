import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure'; // since 3.20.0

export default defineConfig({
	basePath: '/studio', // Ensure it matches your route name
	projectId: 'lbo1agd3', // Replace with your Sanity project ID
	dataset: 'production',
	title: 'ABR Landscaping', // Replace with your desired title, e.g., '"My Studio"' or your project name, This title will be shown in Studio top bar. You can rename it anytime.
	plugins: [structureTool()],
	schema: {
		types: []
	}
});

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure'; // since 3.20.0
import { schemaTypes } from './schemaTypes';
import { visionTool } from '@sanity/vision';
import { media } from 'sanity-plugin-media';
export default defineConfig({
	basePath: '/studio', // Ensure it matches your route name
	projectId: 'lbo1agd3', // Replace with your Sanity project ID
	dataset: 'production',
	title: 'ABR Landscaping', // Replace with your desired title, e.g., '"My Studio"' or your project name, This title will be shown in Studio top bar. You can rename it anytime.
	plugins: [structureTool({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        structure: (S, context) =>
      
        S.list()
          .title('Base')
          .items([
            S.documentTypeListItem('project').title('Projects'),
            S.divider(),
            S.documentTypeListItem('service').title('Services'),
            S.documentTypeListItem('premise').title('Premises'),
        ])
        }
    ), visionTool(), media()],
	schema: {
		types: schemaTypes
	}
    
});

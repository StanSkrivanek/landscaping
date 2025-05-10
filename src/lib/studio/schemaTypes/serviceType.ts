import { WrenchIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
const service = defineType({
	name: 'service',
	title: 'Service',
	icon: WrenchIcon,
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Service Title',
			type: 'string',
			description: 'Enter the service title (e.g., "Landscaping")'
		}),
		defineField({
			name: 'slug',
			title: 'Service Slug',
			type: 'slug',
			options: {
				source: 'title',
				maxLength: 96,
				slugify: (input) => input.toLowerCase().replace(/\s+/g, '-').slice(0, 96)
			}
		}),
		//  headline
		defineField({
			name: 'headline',
			title: 'Service Headline',
			type: 'string',
			description: 'Enter a short headliner for the service '
		}),
		// list of 3 short descriptions of current service
		defineField({
			name: 'shortDescription',
			title: 'Service Short Description',
			type: 'array',
			of: [
				{
					type: 'block'
				}
			],
			description: 'Enter 3 short descriptions of the service as list items'
		}),
		//  rich text description
		defineField({
			name: 'description',
			title: 'Service Description',
			type: 'array',
			of: [
				{
					type: 'block'
				}
			],
			description: 'Enter a longer description of the service'
			// validation: (rule) => rule.required().min(50).max(320).error('Max 320 characters.')
		}),

		// thumbnail image
		defineField({
			name: 'thumbnail',
			title: 'Service Thumbnail',
			type: 'image',
			options: {
				hotspot: true
			}
		}),
		// main image
		defineField({
			name: 'mainImage',
			title: 'Main Image',
			type: 'image',
			options: {
				hotspot: true
			}
		}),

		defineField({
			name: 'gallery',
			title: 'Gallery',
			type: 'array',
			of: [{ type: 'image' }],
			options: {
				layout: 'grid'
			},
			description: 'Add 6 images to the gallery'
		}),
		defineField({
			name: 'position',
			title: 'Position',
			type: 'number',
			description: 'Enter the position of the service in the list (1-...)'
		})
		// defineField({
		//     name: 'icon',
		//     title: 'Service Icon',
		//     type: 'image',
		//     options: {
		//         hotspot: true
		//     }
		// }),
	]
});

export default service;

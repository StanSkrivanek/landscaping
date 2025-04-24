import { defineField, defineType } from 'sanity';
import { WrenchIcon } from '@sanity/icons';
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
                // slugify: (input) => input
                // 	.toLowerCase()
                // 	.replace(/\s+/g, '-')
                // 	.slice(0, 200)
            }
        }),
        // reference to premise type
        // defineField({
        //     name: 'premiseType',
        //     title: 'Premise Type',
        //     type: 'reference',
        //     to: [{ type: 'premise' }]
        // }),
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
            description: 'Enter a short description of the service (e.g., "Landscaping")'
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

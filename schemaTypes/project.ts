import { defineField, defineType } from 'sanity';
import { SparkleIcon } from '@sanity/icons';
const project = defineType({
	name: 'project',
	title: 'Project',
    icon: SparkleIcon,
	type: 'document',
	fields: [
		// reference to premise type
		defineField({
			name: 'projectRef',
			title: 'Project Ref title',
			type: 'string'
		}),
		defineField({
			name: 'premiseType',
			title: 'Premise Type',
			type: 'reference',
			to: [{ type: 'premise' }]
		}),
        

		defineField({
			name: 'location',
			title: 'Project Location',
			type: 'string',
			description: 'Enter the project location (town, village, place ...)'
		}),
		defineField({
			name: 'overview',
			title: 'job Overview',
			type: 'text',
			description: 'Enter a short overview of the job (320 char max)',
			validation: (rule) => rule.required().min(50).max(320).error('Max 320 characters.')
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
			type: 'array',
			of: [{ type: 'image' }],
			options: {
				layout: 'grid'
			}
		}),
		// 4 supportive images
		defineField({
			name: 'image1',
			title: 'Image 1',
			type: 'image',
			options: {
				hotspot: true
			}
		}),
		defineField({
			name: 'image2',
			title: 'Image 2',
			type: 'image',
			options: {
				hotspot: true
			}
		}),
		defineField({
			name: 'image3',
			title: 'Image 3',
			type: 'image',
			options: {
				hotspot: true
			}
		}),
		defineField({
			name: 'image4',
			title: 'Image 4',
			type: 'image',
			options: {
				hotspot: true
			}
		}),
		//  is featured
		defineField({
			name: 'isFeatured',
			title: 'Is Featured',
			type: 'boolean',
			description: 'Check this box if this project is featured'
		})
		// defineField({
		// 	name: 'startDate',
		// 	title: 'Start Date',
		// 	type: 'datetime'
		// }),
		// defineField({
		// 	name: 'endDate',
		// 	title: 'End Date',
		// 	type: 'datetime'
		// }),
		// defineField({
		// 	name: 'status',
		// 	title: 'Status',
		// 	type: 'string'
		// })
		// defineField({
		//     name: 'location',
		//     title: 'Location',
		//     type: 'geopoint'
		// }),
	]
});

export default project;

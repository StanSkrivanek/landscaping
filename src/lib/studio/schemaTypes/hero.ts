import { SparkleIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
const pageHero = defineType({
	name: 'hero',
	title: 'Hero',
	icon: SparkleIcon,
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'For which page?',
			type: 'string',
			description: 'Enter the page for which this hero is intended '
		}),
		defineField({
			name: 'slogan',
			title: 'Hero Title',
			type: 'string',
			description: 'Enter the Hero title (e.g., "Landscaping")'
		}),
		defineField({
			name: 'mainImage',
			title: 'Main Image',
			type: 'image',
			options: {
				hotspot: true
			}
		}),
		defineField({
			name: 'introduction',
			title: 'Hero Introduction',
			type: 'array',
			of: [
				{
					type: 'block'
				}
			],
			description: 'Enter a longer introduction for the hero section'
			// validation: (rule) => rule.required().min(50).max(320).error('Max 320 characters.')
		})
	]
});

export default pageHero;

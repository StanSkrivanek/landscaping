import { DiamondIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
const testimonial = defineType({
	name: 'testimonial',
	title: 'Testimonial',
	icon: DiamondIcon,
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Reviewer ',
			type: 'string',
			description: 'Enter reviewers name (e.g., "Jon Doe" "Peterson family" "Jane & Peter")'
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: {
				source: 'title',
				maxLength: 96,
				slugify: (input) => input.toLowerCase().replace(/\s+/g, '-').slice(0, 96)
			}
		}),
		// main image
		defineField({
			name: 'sliderImage',
			title: 'Slider Image',
			type: 'image',
			options: {
				hotspot: true
			}
		}),
		defineField({
			name: 'testimony',
			title: 'Testimony',
			type: 'text',
			description: 'Enter short testimonial',
			validation: (rule) => rule.required().min(50).max(360).error('Max 360characters.')
		}), //  is featured
		defineField({
			name: 'isFeatured',
			title: 'Is Featured',
			type: 'boolean',
			description: 'Check this box to display testimonial'
		})
	]
});

export default testimonial;

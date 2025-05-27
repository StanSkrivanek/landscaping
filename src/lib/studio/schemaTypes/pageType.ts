import { defineField, defineType } from 'sanity';
import { ComposeIcon } from '@sanity/icons';

const page = defineType({
    name: 'page',
    title: 'Page',
    icon: ComposeIcon,
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Page Title',
            type: 'string',
            description: 'Enter the title of the page'
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
        // defineField({
        //     name: 'updated_at',
        //     title: 'Last Updated',
        //     type: 'datetime',
        //     description: 'The date and time when the page was last updated'
        // }),
        defineField({
            name: 'content',
            title: 'Page content',
            type: 'array',
            of: [{ type: 'block' }],
            description: 'Add content for this page'
        })
    ]
});

export default page;

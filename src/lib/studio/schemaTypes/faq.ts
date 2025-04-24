
import { defineField, defineType } from 'sanity';
import { AddCommentIcon } from '@sanity/icons';

const faq = defineType({
	name: 'faq',
    title: 'FAQ',
    type: 'document',
    icon: AddCommentIcon,
    fields: [
        defineField({
            name: 'question',
            title: 'Question',
            type: 'string'
        }),
        defineField({
            name: 'answer',
            title: 'Answer',
            type: 'text'
        })
    ],
    preview: {
        select: {
            title: 'question'
        }
    }
});

export default faq;
import { defineField, defineType } from 'sanity';

 const premiseType = defineType({
    name: 'premise',
    title: 'Premise',
    type: 'document',
    fields: [
        defineField({
            name: 'type',
            title: 'Type',
            type: 'string',
        })
    ]
})

export default premiseType;
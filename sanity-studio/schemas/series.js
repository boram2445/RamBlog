const series = { 
    title: 'Series',
    name: 'series',
    type: 'document',
    fields: [
        {
        name: 'seriesName',
        title: 'Series Name',
        type: 'string',
        validation: (Rule) => Rule.required(),
        },
        {
        name: 'author',
        title: 'Author',
        type: 'reference',
        to: [{type: 'user'}],
        validation: (Rule) => Rule.required(),
        },
        {
        name: 'description',
        title: 'Description',
        type: 'string',
        },
    ]
}

export default series;
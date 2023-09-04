export default {
  title: 'Tag',
  name: 'tag',
  type: 'document',
  fields: [
    {
      name: 'tagName',
      title: 'Tag Name',
      type: 'string',
    },
    {
      title: 'Users',
      name: 'users',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'user'}],
        },
      ],
      validation: (Rule) => Rule.unique(),
    },
  ],
}

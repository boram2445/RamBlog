export default {
  title: 'Post',
  name: 'post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      title: 'Description',
      name: 'description',
      type: 'string',
    },
    {
      title: 'Pinned',
      name: 'pinned',
      type: 'boolean',
    },
    {
      title: 'Tags',
      name: 'tags',
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
      validation: (Rule) => Rule.unique(),
    },
    {
      title: 'Content',
      name: 'content',
      type: 'string',
    },
  ],
}

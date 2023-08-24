export default {
  title: 'Post',
  name: 'post',
  type: 'document',
  fields: [
    {
      title: 'Author',
      name: 'author',
      type: 'reference',
      to: [{type: 'user'}],
    },
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
      title: 'Main image',
      name: 'mainImage',
      type: 'string',
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
  preview: {
    select: {
      title: 'title',
      publishedAt: 'publishedAt',
    },
    prepare(selection) {
      const {title, publishedAt} = selection
      return {
        title,
        subtitle: publishedAt,
      }
    },
  },
}

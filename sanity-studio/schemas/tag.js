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
      name: 'createdBy',
      title: 'Created By',
      type: 'reference',
      to: [{type: 'user'}],
    },
  ],
}

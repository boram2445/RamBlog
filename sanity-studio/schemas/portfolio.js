export default {
  title: 'Portfolio',
  name: 'portfolio',
  type: 'document',
  fields: [
    {
      title: 'Author',
      name: 'author',
      type: 'reference',
      to: [{type: 'user'}],
    },
    {
      title: 'Skills',
      name: 'skills',
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
      validation: (Rule) => Rule.unique(),
    },
    {
      title: 'Introduce',
      name: 'introduce',
      type: 'text',
    },
    {
      title: 'Business experiences',
      name: 'businessExperiences',
      type: 'array',
      of: [
        {
          title: 'Business',
          name: 'business',
          type: 'object',
          fields: [
            {
              title: 'Name',
              name: 'name',
              type: 'string',
            },
            {
              title: 'Start date',
              name: 'startDate',
              type: 'date',
            },
            {
              title: 'End date',
              name: 'endDate',
              type: 'date',
            },
            {
              title: 'Holding',
              name: 'holding',
              type: 'boolean',
            },
            {
              title: 'Content',
              name: 'content',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      title: 'Projects',
      name: 'projects',
      type: 'array',
      of: [
        {
          title: 'project',
          name: 'project',
          type: 'object',
          fields: [
            {
              title: 'Name',
              name: 'name',
              type: 'string',
            },
            {
              title: 'Image',
              name: 'image',
              type: 'string',
            },
            {
              title: 'Link',
              name: 'link',
              type: 'string',
            },
            {
              title: 'Start date',
              name: 'startDate',
              type: 'date',
            },
            {
              title: 'End date',
              name: 'endDate',
              type: 'date',
            },
            {
              title: 'Holding',
              name: 'holding',
              type: 'boolean',
            },
            {
              title: 'Content',
              name: 'content',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      title: 'Educations',
      name: 'educations',
      type: 'array',
      of: [
        {
          title: 'Education',
          name: 'education',
          type: 'object',
          fields: [
            {
              title: 'Name',
              name: 'name',
              type: 'string',
            },
            {
              title: 'Start date',
              name: 'startDate',
              type: 'date',
            },
            {
              title: 'End date',
              name: 'endDate',
              type: 'date',
            },
            {
              title: 'Holding',
              name: 'holding',
              type: 'boolean',
            },
            {
              title: 'Content',
              name: 'content',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      authorName: 'author.username',
    },
    prepare(selection) {
      const {authorName} = selection
      return {
        title: authorName,
      }
    },
  },
}

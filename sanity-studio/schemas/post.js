import {loggedInUserComment, guestComment} from './comment'

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
      title: 'Likes',
      name: 'likes',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'user'}],
        },
      ],
      validation: (Rule) => Rule.unique(),
    },
    {
      title: 'Tags',
      name: 'tags',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'tag'}],
        },
      ],
      validation: (Rule) => Rule.unique(),
    },
    {
      title: 'Content',
      name: 'content',
      type: 'string',
    },
    {
      title: 'Comments',
      name: 'comments',
      type: 'array',
      of: [
        {
          title: 'Logged In User Comment',
          name: 'loggedInUserComment',
          type: 'object',
          fields: [
            {
              title: 'Deleted',
              name: 'deleted',
              type: 'boolean',
            },
            {
              title: 'Author',
              name: 'author',
              type: 'reference',
              to: [{type: 'user'}],
            },
            {
              title: 'Comment',
              name: 'comment',
              type: 'string',
            },
            {
              title: 'CreatedAt',
              name: 'createdAt',
              type: 'datetime',
            },
            {
              title: 'Comments',
              name: 'comments',
              type: 'array',
              of: [loggedInUserComment, guestComment],
            },
          ],
        },
        {
          title: 'Guest Comment',
          name: 'guestComment',
          type: 'object',
          fields: [
            {
              title: 'Deleted',
              name: 'deleted',
              type: 'boolean',
            },
            {
              title: 'Guest name',
              name: 'name',
              type: 'string',
            },
            {
              title: 'Password',
              name: 'password',
              type: 'string',
            },
            {
              title: 'Comment',
              name: 'comment',
              type: 'string',
            },
            {
              title: 'CreatedAt',
              name: 'createdAt',
              type: 'datetime',
            },
            {
              title: 'Comments',
              name: 'comments',
              type: 'array',
              of: [loggedInUserComment, guestComment],
            },
          ],
        },
      ],
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

export default {
  title: 'User',
  name: 'user',
  type: 'document',
  fields: [
    {
      title: 'Username',
      name: 'username',
      type: 'string',
    },
    {
      title: 'Name',
      name: 'name',
      type: 'string',
    },
    {
      title: 'Email',
      name: 'email',
      type: 'string',
    },
    {
      title: 'Password',
      name: 'password',
      type: 'string',
    },
    {
      title: 'Image',
      name: 'image',
      type: 'string',
    },
    {
      title: 'Blog Name',
      name: 'blogName',
      type: 'string',
    },
    {
      title: 'Profile Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Profile Introduce',
      name: 'introduce',
      type: 'string',
    },
    {
      title: 'Links',
      name: 'links',
      type: 'object',
      fields: [
        {
          title: 'Github',
          name: 'github',
          type: 'string',
        },
        {
          title: 'Email',
          name: 'email',
          type: 'string',
        },
        {
          title: 'Twitter',
          name: 'twitter',
          type: 'string',
        },
        {
          title: 'Facebook',
          name: 'facebook',
          type: 'string',
        },
        {
          title: 'Youtube',
          name: 'youtube',
          type: 'string',
        },
        {
          title: 'HomePage',
          name: 'homePage',
          type: 'string',
        },
      ],
    },
    {
      title: 'Following',
      name: 'following',
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
      title: 'Followers',
      name: 'followers',
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
      title: 'Bookmarks',
      name: 'bookmarks',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'post'}],
        },
      ],
      validation: (Rule) => Rule.unique(),
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'username',
    },
  },
}

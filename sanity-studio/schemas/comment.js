export const loggedInUserComment = {
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
  ],
}

export const guestComment = {
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
  ],
}

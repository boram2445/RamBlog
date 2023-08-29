import { client } from './sanity';

export type Comment = {
  id: string;
  username: string;
  image?: string;
  comment: string;
  type: 'loggedInUserComment' | 'guestComment';
  createdAt: Date;
  recomments?: Comment[];
};

const commentProjection = `
  createdAt,
  "id":_key,
  "comment": comment,
  "type":_type,
  _type == 'loggedInUserComment' => {
    "username":author->username,
    "image":author->image
  },
  _type == 'guestComment' => {
    "username":name
  },
`;

export async function getPostComments(postId: string) {
  return await client.fetch(
    `*[_type == "post" && _id == "${postId}"][0]{
      "comments": comments[]{
       ${commentProjection}
       "recomments": comments[]{
        ${commentProjection}
       }
      },
    }.comments`
  );
}

export async function addComment(
  postId: string,
  {
    type,
    text,
    name,
    password,
  }: {
    type: 'loggedInUserComment' | 'guestComment';
    text: string;
    name?: string;
    password?: string;
  },
  userId?: string
) {
  let commentTypeProjection;
  const now = new Date();

  if (type === 'loggedInUserComment') {
    commentTypeProjection = {
      _type: 'loggedInUserComment',
      comment: text,
      author: { _ref: userId, _type: 'reference' },
      createdAt: now.toISOString(),
    };
  } else if (type === 'guestComment') {
    commentTypeProjection = {
      _type: 'guestComment',
      comment: text,
      name: name,
      password: password,
      createdAt: now.toISOString(),
    };
  }

  return client
    .patch(postId)
    .setIfMissing({ comments: [] })
    .append('comments', [commentTypeProjection])
    .commit({ autoGenerateArrayKeys: true });
}

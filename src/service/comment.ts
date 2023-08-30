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
       } | order(createdAt desc),
      } | order(createdAt desc),
    }.comments`
  );
}

async function addNestedComment(
  postId: string,
  commentId: string,
  commentTypeProjection: any
) {
  const appendType = `comments[_key == "${commentId}"].comments`;

  return client
    .patch(postId)
    .setIfMissing({ [appendType]: [] })
    .append(appendType, [commentTypeProjection])
    .commit({ autoGenerateArrayKeys: true });
}

async function addTopLevelComment(postId: string, commentTypeProjection: any) {
  return client
    .patch(postId)
    .setIfMissing({ comments: [] })
    .append('comments', [commentTypeProjection])
    .commit({ autoGenerateArrayKeys: true });
}

// 댓글 추가 함수
export async function addComment(
  postId: string,
  {
    type,
    text,
    name,
    password,
    commentId,
  }: {
    type: 'loggedInUserComment' | 'guestComment';
    text: string;
    name?: string;
    password?: string;
    commentId?: string;
  },
  userId?: string
) {
  const now = new Date();
  let commentTypeProjection;

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

  return commentId
    ? addNestedComment(postId, commentId, commentTypeProjection)
    : addTopLevelComment(postId, commentTypeProjection);
}

export async function checkPassword(
  password: string,
  postId: string,
  commentId: string,
  parentCommentId?: string
) {
  let passwordProjection;

  if (parentCommentId) {
    passwordProjection = `
    *[_type == "post" && _id == "${postId}"][0]{
      'password': comments[_key == "${parentCommentId}"][0].comments[_key == "${commentId}"][0].password
   }`;
  } else {
    passwordProjection = `
    *[_type == "post" && _id == "${postId}"][0]{
      'password': comments[_key == "${commentId}"][0].password
    }
    `;
  }

  const res = await client.fetch(passwordProjection);

  console.log(res.password, password);
  return res.password === password;
}

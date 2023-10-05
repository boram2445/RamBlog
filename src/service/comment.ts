import { client } from './sanity';
import bcrypt from 'bcrypt';

const commentProjection = `
  createdAt,
  deleted,
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
      deleted: false,
      _type: 'loggedInUserComment',
      comment: text,
      author: { _ref: userId, _type: 'reference' },
      createdAt: now.toISOString(),
    };
  } else if (type === 'guestComment') {
    commentTypeProjection = {
      deleted: false,
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
  const isSame = bcrypt.compareSync(password, res.password);
  return isSame;
}

async function findComment(
  postId: string,
  commentId: string,
  parentCommentId: string | null
) {
  const commentPath = parentCommentId
    ? `comments[_key == "${parentCommentId}"].comments[_key == "${commentId}"]`
    : `comments[_key == "${commentId}"]`;

  const existingComment = await client.fetch(
    `*[_id == "${postId}"][0].${commentPath}`
  );

  return [commentPath, existingComment[0]];
}

export async function deleteComment(
  postId: string,
  commentId: string,
  parentCommentId: string | null
) {
  const [commentPath, existingComment] = await findComment(
    postId,
    commentId,
    parentCommentId
  );

  if (existingComment) {
    const updatedComment = {
      ...existingComment,
      deleted: true,
      comment: '삭제된 댓글 입니다',
    };

    return client
      .patch(postId)
      .insert('replace', commentPath, [updatedComment])
      .commit();
  } else {
    return Promise.reject('Comment not found');
  }
}

import { defineQuery } from 'groq';
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
    "slug":author->slug,
    "image":author->image,
    "authorId":author._ref
  },
  _type == 'guestComment' => {
    "username":name
  },
`;

const postCommentsQuery = defineQuery(`
  *[_type == "post" && _id == $postId][0]{
    "comments": comments[]{
     ${commentProjection}
     "recomments": comments[]{
      ${commentProjection}
     } | order(createdAt desc),
    } | order(createdAt desc),
  }.comments
`);

const nestedCommentPasswordQuery = defineQuery(`
  *[_type == "post" && _id == $postId][0]{
    'password': comments[_key == $parentCommentId][0].comments[_key == $commentId][0].password
  }
`);

const topLevelCommentPasswordQuery = defineQuery(`
  *[_type == "post" && _id == $postId][0]{
    'password': comments[_key == $commentId][0].password
  }
`);

const nestedCommentByKeyQuery = defineQuery(`
  *[_id == $postId][0].comments[_key == $parentCommentId].comments[_key == $commentId]
`);

const topLevelCommentByKeyQuery = defineQuery(`
  *[_id == $postId][0].comments[_key == $commentId]
`);

export async function getPostComments(postId: string) {
  return await client.fetch(
    postCommentsQuery,
    { postId },
    {
      cache: 'force-cache',
      next: { tags: [`comments/${postId}`] },
    }
  );
}

async function addNestedComment(
  postId: string,
  commentId: string,
  commentTypeProjection: any
) {
  // NOTE: findComment의 commentPath와 동일한 종류 — patch 경로 selector라 $param
  // 바인딩 대상이 아님. commentId는 클라이언트 입력 — 트래킹: week2-issues.md
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
  const res = parentCommentId
    ? await client.fetch(
        nestedCommentPasswordQuery,
        { postId, parentCommentId, commentId },
        { cache: 'no-store' }
      )
    : await client.fetch(
        topLevelCommentPasswordQuery,
        { postId, commentId },
        { cache: 'no-store' }
      );

  const isSame = bcrypt.compareSync(password, res?.password ?? '');
  return isSame;
}

async function findComment(
  postId: string,
  commentId: string,
  parentCommentId: string | null
) {
  // NOTE: commentPath는 GROQ 쿼리가 아니라 deleteComment의 patch(.insert()) 경로 selector
  // 문자열이라 $param 바인딩 대상이 아님. 조회(client.fetch)는 별도의 바인딩된 쿼리로 수행.
  // commentId/parentCommentId는 API 요청(URL 쿼리/body)에서 그대로 온 클라이언트 입력이라
  // dislikePost/unfollow의 세션 유래 _id보다 신뢰 수준이 낮음 — 트래킹: week2-issues.md
  const commentPath = parentCommentId
    ? `comments[_key == "${parentCommentId}"].comments[_key == "${commentId}"]`
    : `comments[_key == "${commentId}"]`;

  const existingComment = parentCommentId
    ? await client.fetch(
        nestedCommentByKeyQuery,
        { postId, parentCommentId, commentId },
        { cache: 'no-store' }
      )
    : await client.fetch(
        topLevelCommentByKeyQuery,
        { postId, commentId },
        { cache: 'no-store' }
      );

  return [commentPath, existingComment?.[0]] as const;
}

export async function getCommentMeta(
  postId: string,
  commentId: string,
  parentCommentId: string | null
) {
  const [, existingComment] = await findComment(postId, commentId, parentCommentId);
  if (!existingComment) return null;

  return {
    type: existingComment._type,
    authorId:
      existingComment._type === 'loggedInUserComment'
        ? existingComment.author?._ref
        : undefined,
  };
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

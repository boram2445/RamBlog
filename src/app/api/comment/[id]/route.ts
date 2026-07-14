import { auth } from '@/auth';
import { NextResponse, NextRequest } from "next/server";
import {
  addComment,
  checkPassword,
  deleteComment,
  getCommentMeta,
  getPostComments,
} from '@/service/comment';
import { getPostAuthorId } from '@/service/posts';
import { revalidateTag } from 'next/cache';
import bcrypt from 'bcrypt';
import { commentKeySchema } from '@/lib/validation';
import { withErrorHandler, HttpError } from '@/lib/api-handler';

type Context = {
  params: Promise<{ id: string }>;
};

export const GET = withErrorHandler(async (_: Request, context: Context) => {
  return await getPostComments((await context.params).id).then((data) =>
    NextResponse.json(data)
  );
});

export const POST = withErrorHandler(
  async (req: NextRequest, context: Context) => {
    const data = await req.json();

    let user;
    if (data.type === 'loggedInUserComment') {
      const session = await auth();
      user = session?.user;

      if (!user) {
        throw new HttpError(401, '로그인이 필요합니다.');
      }
    } else if (data.type === 'guestComment') {
      if (!data.name || !data.password) {
        throw new HttpError(400, '이름과 비밀번호를 입력해주세요.');
      }
    }

    if (
      data.commentId &&
      !commentKeySchema.safeParse(data.commentId).success
    ) {
      throw new HttpError(400, '잘못된 요청입니다.');
    }

    const newData =
      data.type === 'loggedInUserComment'
        ? data
        : { ...data, password: bcrypt.hashSync(data.password, 12) };

    const postId = (await context.params).id;
    const result = await addComment(postId, newData, user?.id).then((res) =>
      NextResponse.json(res)
    );

    revalidateTag(`comments/${postId}`, { expire: 0 });
    return result;
  }
);

export const DELETE = withErrorHandler(
  async (req: NextRequest, context: Context) => {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const commentId = searchParams.get('commentId');
    const parentCommentId = searchParams.get('parentCommentId');

    if (!commentId || !commentKeySchema.safeParse(commentId).success) {
      throw new HttpError(400, '잘못된 요청입니다.');
    }
    if (
      parentCommentId &&
      !commentKeySchema.safeParse(parentCommentId).success
    ) {
      throw new HttpError(400, '잘못된 요청입니다.');
    }

    const postId = (await context.params).id;
    const meta = await getCommentMeta(postId, commentId, parentCommentId);

    if (!meta) {
      throw new HttpError(404, '댓글을 찾을 수 없습니다.');
    }

    if (meta.type === 'guestComment') {
      const body = await req.json().catch(() => ({}));
      const password = body?.password;

      if (!password) {
        throw new HttpError(400, '비밀번호를 입력해주세요.');
      }

      const isValid = await checkPassword(
        password,
        postId,
        commentId,
        parentCommentId ?? undefined
      );
      if (!isValid) {
        throw new HttpError(401, '비밀번호가 일치하지 않습니다.');
      }
    } else {
      const session = await auth();
      const user = session?.user;

      if (!user) {
        throw new HttpError(401, '로그인이 필요합니다.');
      }

      const postAuthorId = (await getPostAuthorId(postId))?.authorId;
      const isOwner = user.id === meta.authorId || user.id === postAuthorId;

      if (!isOwner) {
        throw new HttpError(403, '권한이 없습니다.');
      }
    }

    const result = await deleteComment(postId, commentId, parentCommentId).then(
      (res) => NextResponse.json(res)
    );

    revalidateTag(`comments/${postId}`, { expire: 0 });
    return result;
  }
);

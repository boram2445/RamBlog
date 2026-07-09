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

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: Context) {
  return await getPostComments((await context.params).id).then((data) =>
    NextResponse.json(data)
  );
}

export async function POST(req: NextRequest, context: Context) {
  const data = await req.json();

  let user;
  if (data.type === 'loggedInUserComment') {
    const session = await auth();
    user = session?.user;

    if (!user) {
      return new Response(`Authentication Error`, { status: 401 });
    }
  } else if (data.type === 'guestComment') {
    if (!data.name || !data.password) {
      return new Response('Bad Request', { status: 400 });
    }
  }

  if (data.commentId && !commentKeySchema.safeParse(data.commentId).success) {
    return new Response('Bad Request', { status: 400 });
  }

  const newData =
    data.type === 'loggedInUserComment'
      ? data
      : { ...data, password: bcrypt.hashSync(data.password, 12) };

  const postId = (await context.params).id;
  const result = await addComment(postId, newData, user?.id)
    .then((res) => NextResponse.json(res))
    .catch((error) => new Response(JSON.stringify(error), { status: 500 }));

  revalidateTag(`comments/${postId}`, 'max');
  return result;
}

export async function DELETE(req: NextRequest, context: Context) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.search);
  const commentId = searchParams.get('commentId');
  const parentCommentId = searchParams.get('parentCommentId');

  if (!commentId || !commentKeySchema.safeParse(commentId).success) {
    return new Response('Bad Request', { status: 400 });
  }
  if (parentCommentId && !commentKeySchema.safeParse(parentCommentId).success) {
    return new Response('Bad Request', { status: 400 });
  }

  const postId = (await context.params).id;
  const meta = await getCommentMeta(postId, commentId, parentCommentId);

  if (!meta) {
    return new Response('Not Found', { status: 404 });
  }

  if (meta.type === 'guestComment') {
    const body = await req.json().catch(() => ({}));
    const password = body?.password;

    if (!password) {
      return new Response('Bad Request', { status: 400 });
    }

    const isValid = await checkPassword(
      password,
      postId,
      commentId,
      parentCommentId ?? undefined
    );
    if (!isValid) {
      return new Response('Authentication Error', { status: 401 });
    }
  } else {
    const session = await auth();
    const user = session?.user;

    if (!user) {
      return new Response('Authentication Error', { status: 401 });
    }

    const postAuthorId = (await getPostAuthorId(postId))?.authorId;
    const isOwner = user.id === meta.authorId || user.id === postAuthorId;

    if (!isOwner) {
      return new Response('Forbidden', { status: 403 });
    }
  }

  const result = await deleteComment(postId, commentId, parentCommentId)
    .then((res) => NextResponse.json(res))
    .catch((error) => new Response(JSON.stringify(error), { status: 500 }));

  revalidateTag(`comments/${postId}`, 'max');
  return result;
}

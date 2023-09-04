import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from 'next/server';
import { addComment, deleteComment, getPostComments } from '@/service/comment';
import { authOptions } from '../../auth/[...nextauth]/options';
import bcrypt from 'bcrypt';

type Context = {
  params: { id: string };
};

export async function GET(_: Request, context: Context) {
  return await getPostComments(context.params.id).then((data) =>
    NextResponse.json(data)
  );
}

export async function POST(req: NextRequest, context: Context) {
  const data = await req.json();

  let user;
  if (data.type === 'loggedInUserComment') {
    const session = await getServerSession(authOptions);
    user = session?.user;

    if (!user) {
      return new Response(`Authentication Error`, { status: 401 });
    }
  } else if (data.type === 'guestComment') {
    if (!data.name || !data.password) {
      return new Response('Bad Request', { status: 400 });
    }
  }

  const newData =
    data.type === 'loggedInUserComment'
      ? data
      : { ...data, password: bcrypt.hashSync(data.password, 2) };

  return addComment(context.params.id, newData, user?.id)
    .then((res) => NextResponse.json(res))
    .catch((error) => new Response(JSON.stringify(error), { status: 500 }));
}

export async function DELETE(req: NextRequest, context: Context) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.search);
  const commentId = searchParams.get('commentId');
  const parentCommentId = searchParams.get('parentCommentId');

  if (!commentId) {
    return new Response('Bad Request', { status: 400 });
  }

  return deleteComment(context.params.id, commentId, parentCommentId)
    .then((res) => NextResponse.json(res))
    .catch((error) => new Response(JSON.stringify(error), { status: 500 }));
}

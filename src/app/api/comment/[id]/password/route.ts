import { NextResponse, NextRequest } from 'next/server';
import { checkPassword } from '@/service/comment';

type Context = {
  params: { id: string };
};

export async function POST(req: NextRequest, context: Context) {
  const data = await req.json();

  if (!data.commentId || !data.password) {
    return new Response('Bad Request', { status: 400 });
  }

  const res = await checkPassword(
    data.password,
    context.params.id,
    data.commentId,
    data.parentCommentId ?? ''
  );

  if (!res) {
    return new Response(`Authentication Error`, { status: 401 });
  }

  return NextResponse.json(res);
}

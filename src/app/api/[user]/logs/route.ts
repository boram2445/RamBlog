import { createLog, getAllUserLogs } from '@/service/log';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/options';

type Context = {
  params: { user: string };
};

export async function GET(_: Request, context: Context) {
  const { user } = context.params;

  if (!user) {
    return new NextResponse('Bad Reqest', { status: 400 });
  }

  return await getAllUserLogs(user).then((data) => NextResponse.json(data));
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new Response(`Authentication Error`, { status: 401 });
  }

  const form = await req.formData();
  const title = form.get('title')?.toString();
  const content = form.get('content')?.toString();
  const file = (form.get('file') as Blob) ?? '';

  if (!title || !content) {
    return new Response('Bad request', { status: 400 });
  }

  return await createLog(user.id, title, content, file).then((data) =>
    NextResponse.json(data)
  );
}

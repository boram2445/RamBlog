import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { deleteLog } from '@/service/log';

type Context = {
  params: { id: string };
};

export async function DELETE(_: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) {
    return new Response(`Authentication Error`, { status: 401 });
  }

  const id = context.params.id;
  if (!id) return new Response('Bad Request', { status: 400 });

  const result = await deleteLog(id).then((data) => NextResponse.json(data));

  revalidateTag('logs');

  return result;
}

import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from "next/server";
import { withSessionUser } from '@/utils/session';
import { deleteLog, getUserLog } from '@/service/log';

type Context = {
  params: Promise<{ user: string; id: string }>;
};

export async function GET(_: Request, context: Context) {
  const { user, id } = (await context.params);

  if (!user || !id) {
    return new NextResponse('Bad Reqest', { status: 400 });
  }

  return getUserLog(user, id).then((data) => NextResponse.json(data));
}

export async function DELETE(_: NextRequest, context: Context) {
  return withSessionUser(async (user) => {
    const id = (await context.params).id;
    if (!id) return new Response('Bad Request', { status: 400 });

    const result = await deleteLog(id).then((data) => NextResponse.json(data));

    revalidateTag(`log/${user.username}`, 'max');

    return result;
  });
}

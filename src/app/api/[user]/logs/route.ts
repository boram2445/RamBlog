import { getAllUserLogs } from '@/service/log';
import { NextResponse } from 'next/server';

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

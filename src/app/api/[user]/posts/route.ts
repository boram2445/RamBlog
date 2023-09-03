import { getAllUserPosts } from '@/service/posts';
import { NextResponse } from 'next/server';

type Context = {
  params: { user: string };
};

export async function GET(_: Request, context: Context) {
  const { user } = context.params;

  if (!user) {
    return new NextResponse('Bad Reqest', { status: 400 });
  }

  return await getAllUserPosts(user).then((data) => NextResponse.json(data));
}

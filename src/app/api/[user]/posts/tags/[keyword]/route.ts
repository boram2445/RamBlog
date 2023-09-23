import { NextResponse } from 'next/server';
import { getUserTagPosts } from '@/service/posts';

type Context = {
  params: { user: string; keyword: string };
};

export async function GET(_: Request, context: Context) {
  const { user, keyword } = context.params;

  if (!user) {
    return new NextResponse('Bad Reqest', { status: 400 });
  }

  return await getUserTagPosts(user, keyword).then((data) =>
    NextResponse.json(data)
  );
}

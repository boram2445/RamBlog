import { getTagPosts } from '@/service/posts';
import { NextResponse } from 'next/server';

type Context = {
  params: { keyword: string };
};

export async function GET(_: Request, context: Context) {
  const { keyword } = context.params;

  if (!keyword) {
    return new NextResponse('Bad Reqest', { status: 400 });
  }

  return await getTagPosts(keyword).then((data) => NextResponse.json(data));
}

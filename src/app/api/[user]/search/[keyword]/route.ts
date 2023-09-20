import { searchUserPosts } from '@/service/search';
import { NextRequest, NextResponse } from 'next/server';

type Context = {
  params: { user: string; keyword: string };
};

export async function GET(_: NextRequest, context: Context) {
  const { user } = context.params;

  if (!user) {
    return new NextResponse('Bad Reqest', { status: 400 });
  }

  return searchUserPosts(user, context.params.keyword).then((data) =>
    NextResponse.json(data)
  );
}

import { searchUserPosts } from '@/service/search';
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: Promise<{ user: string; keyword: string }>;
};

export async function GET(_: NextRequest, context: Context) {
  const { user } = (await context.params);

  if (!user) {
    return new NextResponse('Bad Reqest', { status: 400 });
  }

  return searchUserPosts(user, (await context.params).keyword).then((data) =>
    NextResponse.json(data)
  );
}

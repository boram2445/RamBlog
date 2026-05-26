import { getTagPosts } from '@/service/posts';
import { NextResponse } from "next/server";

type Context = {
  params: Promise<{ keyword: string }>;
};

export async function GET(_: Request, context: Context) {
  const { keyword } = (await context.params);

  if (!keyword) {
    return new NextResponse('Bad Reqest', { status: 400 });
  }

  return await getTagPosts(keyword).then((data) => NextResponse.json(data));
}

import { getPostDetailLike } from '@/service/posts';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

type Context = {
  params: { id: string };
};

export async function GET(_: NextRequest, context: Context) {
  const res = await getPostDetailLike(context.params.id).then((data) =>
    NextResponse.json(data)
  );

  revalidateTag('like');

  return res;
}

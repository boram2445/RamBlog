import { getPostDetailLike } from '@/service/posts';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_: NextRequest, context: Context) {
  const res = await getPostDetailLike((await context.params).id).then((data) =>
    NextResponse.json(data)
  );

  revalidateTag('like', 'max');

  return res;
}

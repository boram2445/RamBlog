import { getPostDetail } from '@/service/posts';
import { NextResponse } from 'next/server';

type Context = {
  params: { id: string };
};

export async function GET(_: Request, context: Context) {
  return await getPostDetail(context.params.id).then((data) =>
    NextResponse.json(data)
  );
}

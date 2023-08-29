import { NextResponse } from 'next/server';
import { getPostComments } from '@/service/comment';

type Context = {
  params: { id: string };
};

export async function GET(_: Request, context: Context) {
  return await getPostComments(context.params.id).then((data) =>
    NextResponse.json(data)
  );
}

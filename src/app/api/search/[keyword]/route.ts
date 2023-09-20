import { searchAllPosts } from '@/service/search';
import { NextRequest, NextResponse } from 'next/server';

type Context = {
  params: { keyword: string };
};

export async function GET(_: NextRequest, context: Context) {
  return searchAllPosts(context.params.keyword).then((data) =>
    NextResponse.json(data)
  );
}

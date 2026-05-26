import { searchAllPosts } from '@/service/search';
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: Promise<{ keyword: string }>;
};

export async function GET(_: NextRequest, context: Context) {
  return searchAllPosts((await context.params).keyword).then((data) =>
    NextResponse.json(data)
  );
}

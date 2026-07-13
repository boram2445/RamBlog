import { searchAllPosts } from '@/service/search';
import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from '@/lib/api-handler';

type Context = {
  params: Promise<{ keyword: string }>;
};

export const GET = withErrorHandler(async (_: NextRequest, context: Context) => {
  return searchAllPosts((await context.params).keyword).then((data) =>
    NextResponse.json(data)
  );
});

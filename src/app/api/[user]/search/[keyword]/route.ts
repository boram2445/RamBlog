import { searchUserPosts } from '@/service/search';
import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler, HttpError } from '@/lib/api-handler';

type Context = {
  params: Promise<{ user: string; keyword: string }>;
};

export const GET = withErrorHandler(async (_: NextRequest, context: Context) => {
  const { user } = (await context.params);

  if (!user) {
    throw new HttpError(400, '잘못된 요청입니다.');
  }

  return searchUserPosts(user, (await context.params).keyword).then((data) =>
    NextResponse.json(data)
  );
});

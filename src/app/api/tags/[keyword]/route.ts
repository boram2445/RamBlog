import { getTagPosts } from '@/service/posts';
import { NextResponse } from "next/server";
import { withErrorHandler, HttpError } from '@/lib/api-handler';

type Context = {
  params: Promise<{ keyword: string }>;
};

export const GET = withErrorHandler(async (_: Request, context: Context) => {
  const { keyword } = (await context.params);

  if (!keyword) {
    throw new HttpError(400, '잘못된 요청입니다.');
  }

  return await getTagPosts(keyword).then((data) => NextResponse.json(data));
});

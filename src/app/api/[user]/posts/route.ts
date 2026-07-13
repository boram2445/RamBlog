import { getAllUserPosts } from '@/service/posts';
import { NextResponse } from "next/server";
import { withErrorHandler, HttpError } from '@/lib/api-handler';

type Context = {
  params: Promise<{ user: string }>;
};

export const GET = withErrorHandler(async (_: Request, context: Context) => {
  const { user } = (await context.params);

  if (!user) {
    throw new HttpError(400, '잘못된 요청입니다.');
  }

  return await getAllUserPosts(user).then((data) => NextResponse.json(data));
});

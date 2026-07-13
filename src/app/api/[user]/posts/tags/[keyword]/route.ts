import { NextResponse } from "next/server";
import { getUserTagPosts } from '@/service/posts';
import { withErrorHandler, HttpError } from '@/lib/api-handler';

type Context = {
  params: Promise<{ user: string; keyword: string }>;
};

export const GET = withErrorHandler(async (_: Request, context: Context) => {
  const { user, keyword } = (await context.params);

  if (!user) {
    throw new HttpError(400, '잘못된 요청입니다.');
  }

  return await getUserTagPosts(user, keyword).then((data) =>
    NextResponse.json(data)
  );
});

import { Emotion } from '@/model/log';
import { getUserEmotionLogs } from '@/service/log';
import { NextResponse } from "next/server";
import { withErrorHandler, HttpError } from '@/lib/api-handler';
type Context = {
  params: Promise<{ user: string; emotion: string }>;
};

export const GET = withErrorHandler(async (_: Request, context: Context) => {
  const { user, emotion } = (await context.params);

  if (!user || !emotion) {
    throw new HttpError(400, '잘못된 요청입니다.');
  }

  return getUserEmotionLogs(user, emotion as Emotion).then((data) =>
    NextResponse.json(data)
  );
});

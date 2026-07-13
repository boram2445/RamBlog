import { NextResponse } from "next/server";
import { Emotion } from '@/model/log';
import { getUserEmotionLog } from '@/service/log';
import { withErrorHandler, HttpError } from '@/lib/api-handler';

type Context = {
  params: Promise<{ user: string; id: string; emotion: string }>;
};

export const GET = withErrorHandler(async (_: Request, context: Context) => {
  const { user, id, emotion } = (await context.params);

  if (!user || !id || !emotion) {
    throw new HttpError(400, '잘못된 요청입니다.');
  }

  return getUserEmotionLog(user, id, emotion as Emotion).then((data) =>
    NextResponse.json(data)
  );
});

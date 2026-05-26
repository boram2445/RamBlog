import { Emotion } from '@/model/log';
import { getUserEmotionLogs } from '@/service/log';
import { NextResponse } from "next/server";
type Context = {
  params: Promise<{ user: string; emotion: string }>;
};

export async function GET(_: Request, context: Context) {
  const { user, emotion } = (await context.params);

  if (!user || !emotion) {
    return new NextResponse('Bad Reqest', { status: 400 });
  }

  return getUserEmotionLogs(user, emotion as Emotion).then((data) =>
    NextResponse.json(data)
  );
}

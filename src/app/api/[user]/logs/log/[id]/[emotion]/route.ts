import { Emotion, getUserEmotionLog } from '@/service/log';
import { NextResponse } from 'next/server';
type Context = {
  params: { user: string; id: string; emotion: string };
};

export async function GET(_: Request, context: Context) {
  const { user, id, emotion } = context.params;

  if (!user || !id || !emotion) {
    return new NextResponse('Bad Reqest', { status: 400 });
  }

  return getUserEmotionLog(user, id, emotion as Emotion).then((data) =>
    NextResponse.json(data)
  );
}

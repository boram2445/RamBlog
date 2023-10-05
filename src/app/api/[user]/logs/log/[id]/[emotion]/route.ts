import { NextResponse } from 'next/server';
import { Emotion } from '@/model/log';
import { getUserEmotionLog } from '@/service/log';

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

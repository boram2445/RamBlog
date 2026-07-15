import { NextRequest, NextResponse } from "next/server";
import { withSessionUser } from '@/utils/session';
import { revalidateTag } from 'next/cache';
import { createLog, getAllUserLogs } from '@/service/log';
import { withErrorHandler, HttpError } from '@/lib/api-handler';

type Context = {
  params: Promise<{ user: string }>;
};

export const GET = withErrorHandler(async (_: Request, context: Context) => {
  const { user } = (await context.params);

  if (!user) {
    throw new HttpError(400, '잘못된 요청입니다.');
  }

  return await getAllUserLogs(user).then((data) => NextResponse.json(data));
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  return withSessionUser(async (user) => {
    const form = await req.formData();
    const title = form.get('title')?.toString();
    const content = form.get('content')?.toString();
    const emotion = form.get('emotion')?.toString();
    const date = form.get('date')?.toString() ?? '';
    const file = (form.get('file') as Blob) ?? '';

    if (!title || !content) {
      throw new HttpError(400, '제목과 내용을 입력해주세요.');
    }

    const result = await createLog(
      user.id,
      title,
      content,
      date,
      emotion,
      file
    ).then((data) => NextResponse.json(data));

    revalidateTag(`log/${user.slug}`, { expire: 0 });

    return result;
  });
});

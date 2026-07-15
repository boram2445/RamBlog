import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from "next/server";
import { withSessionUser } from '@/utils/session';
import { deleteLog, getUserLog } from '@/service/log';
import { withErrorHandler, HttpError } from '@/lib/api-handler';

type Context = {
  params: Promise<{ user: string; id: string }>;
};

export const GET = withErrorHandler(async (_: Request, context: Context) => {
  const { user, id } = (await context.params);

  if (!user || !id) {
    throw new HttpError(400, '잘못된 요청입니다.');
  }

  return getUserLog(user, id).then((data) => NextResponse.json(data));
});

export const DELETE = withErrorHandler(async (_: NextRequest, context: Context) => {
  return withSessionUser(async (user) => {
    const id = (await context.params).id;
    if (!id) throw new HttpError(400, '잘못된 요청입니다.');

    const result = await deleteLog(id).then((data) => NextResponse.json(data));

    revalidateTag(`log/${user.slug}`, { expire: 0 });

    return result;
  });
});

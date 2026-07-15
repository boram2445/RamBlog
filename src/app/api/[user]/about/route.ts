import { NextRequest, NextResponse } from "next/server";
import { createPortfolio, editPortfolio } from '@/service/portfolio';
import { revalidateTag } from 'next/cache';
import { withSessionUser } from '@/utils/session';
import { withErrorHandler, HttpError } from '@/lib/api-handler';

export const POST = withErrorHandler(async (req: NextRequest) => {
  return withSessionUser(async (user) => {
    const { id, form } = await req.json();

    if (!form) {
      throw new HttpError(400, '잘못된 요청입니다.');
    }

    const request = id
      ? () => editPortfolio(id, form)
      : () => createPortfolio(user.id, form);

    const result = await request().then((data) => NextResponse.json(data));

    revalidateTag(`about/${user.slug}`, { expire: 0 });

    return result;
  });
});

import { NextRequest, NextResponse } from 'next/server';
import { createPortfolio, editPortfolio } from '@/service/portfolio';
import { revalidateTag } from 'next/cache';
import { withSessionUser } from '@/utils/session';

export async function POST(req: NextRequest) {
  return withSessionUser(async (user) => {
    const { id, form } = await req.json();

    if (!form) {
      return new Response('Bad request', { status: 400 });
    }

    const request = id
      ? () => editPortfolio(id, form)
      : () => createPortfolio(user.id, form);

    const result = await request().then((data) => NextResponse.json(data));

    revalidateTag(`about/${user.username}`);

    return result;
  });
}

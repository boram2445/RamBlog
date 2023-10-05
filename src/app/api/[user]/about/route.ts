import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/options';
import { createPortfolio, editPortfolio } from '@/service/portfolio';
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new Response(`Authentication Error`, { status: 401 });
  }

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
}

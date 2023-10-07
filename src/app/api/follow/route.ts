import { follow, unfollow } from '@/service/user';
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { withSessionUser } from '@/utils/session';

export async function PUT(req: NextRequest) {
  return withSessionUser(async (user) => {
    const { id: targetId, follow: isFollow } = await req.json();

    if (!targetId || isFollow === undefined) {
      return new Response('Bad Request', { status: 400 });
    }

    const request = isFollow ? follow : unfollow;

    const result = await request(user.id, targetId) //
      .then((res) => NextResponse.json(res))
      .catch((error) => new Response(JSON.stringify(error), { status: 500 }));

    revalidateTag('following');

    return result;
  });
}

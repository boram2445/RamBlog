import { revalidateTag } from 'next/cache';
import { addBookmark, removeBookmark } from '@/service/user';
import { NextRequest, NextResponse } from 'next/server';
import { getBookmarkPosts } from '@/service/posts';
import { withSessionUser } from '@/utils/session';

export async function GET(_: Request) {
  return withSessionUser(async (user) => {
    return getBookmarkPosts(user.username).then((data) =>
      NextResponse.json(data)
    );
  });
}

export async function PUT(req: NextRequest) {
  return withSessionUser(async (user) => {
    const { id, bookmark } = await req.json();

    if (!id || bookmark === undefined) {
      return new Response('Bad Request', { status: 400 });
    }

    const request = bookmark ? addBookmark : removeBookmark;

    const result = await request(user.id, id)
      .then((res) => NextResponse.json(res))
      .catch((error) => new Response(JSON.stringify(error), { status: 500 }));

    revalidateTag('bookmark');

    return result;
  });
}

import { revalidateTag } from 'next/cache';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { addBookmark, removeBookmark } from '@/service/user';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { getBookmarkPosts } from '@/service/posts';

export async function GET(_: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new Response('Authentication Error', { status: 401 });
  }

  return await getBookmarkPosts(user.username).then((data) =>
    NextResponse.json(data)
  );
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new Response('Authentication Error', { status: 401 });
  }

  const { id, bookmark } = await req.json();

  if (!id || bookmark === undefined) {
    return new Response('Bad Request', { status: 400 });
  }

  const request = bookmark ? addBookmark : removeBookmark;

  const result = request(user.id, id)
    .then((res) => NextResponse.json(res))
    .catch((error) => new Response(JSON.stringify(error), { status: 500 }));

  revalidateTag('bookmark');

  return result;
}

import { withSessionUser } from '@/utils/session';
import { createPost, getAllPostsData } from '@/service/posts';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: Request) {
  return await getAllPostsData().then((data) => NextResponse.json(data));
}

export async function POST(req: NextRequest) {
  return withSessionUser(async (user) => {
    const form = await req.formData();
    const title = form.get('title')?.toString();
    const description = form.get('description')?.toString();
    const tags = form.get('tags')?.toString();
    const content = form.get('content')?.toString();
    const mainImage = form.get('mainImageUrl')?.toString();

    if (!title || !content) {
      return new Response('Bad request', { status: 400 });
    }

    const tagArr = tags?.replace(/ /g, '').split(',');
    const userId = user.id;

    const result = await createPost(
      userId,
      title,
      content,
      description,
      tagArr,
      mainImage
    ).then((data) => NextResponse.json(data));

    revalidateTag(`tags/${user.username}`);
    revalidateTag(`posts/${user.username}`);

    return result;
  });
}

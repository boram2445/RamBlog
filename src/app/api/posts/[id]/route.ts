import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { withSessionUser } from '@/utils/session';
import { deletePost, editPost } from '@/service/posts';

type Context = {
  params: { id: string };
};

export async function POST(req: NextRequest, context: Context) {
  return withSessionUser(async (user) => {
    const form = await req.formData();
    const id = context.params.id;

    const mainImage = form.get('mainImageUrl')?.toString();
    const title = form.get('title')?.toString();
    const description = form.get('description')?.toString();
    const tags = form.get('tags')?.toString();
    const content = form.get('content')?.toString();

    if (!title || !content) {
      return new Response('Bad request', { status: 400 });
    }
    const tagArr = tags?.replace(/ /g, '').split(',');
    const result = await editPost(
      id,
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

export async function DELETE(_: NextRequest, context: Context) {
  return withSessionUser(async (user) => {
    const id = context.params.id;
    if (!id) return new Response('Bad Request', { status: 400 });

    const result = await deletePost(id).then((data) => NextResponse.json(data));

    revalidateTag(`tags/${user.username}`);
    revalidateTag(`posts/${user.username}`);

    return result;
  });
}

import { authOptions } from '../../auth/[...nextauth]/options';
import { deletePost, editPost } from '@/service/posts';
import { getServerSession } from 'next-auth';
import { revalidatePath, revalidateTag } from 'next/cache';

import { NextRequest, NextResponse } from 'next/server';

type Context = {
  params: { id: string };
};

export async function POST(req: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new Response(`Authentication Error`, { status: 401 });
  }

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

  revalidateTag('userTags');
  revalidateTag('userPosts');

  return result;
}

export async function DELETE(_: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) {
    return new Response(`Authentication Error`, { status: 401 });
  }

  const id = context.params.id;
  if (!id) return new Response('Bad Request', { status: 400 });

  const result = await deletePost(id).then((data) => NextResponse.json(data));

  revalidateTag('userTags');
  revalidateTag('userPosts');

  return result;
}

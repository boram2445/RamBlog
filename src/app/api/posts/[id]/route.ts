import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from "next/server";
import { withSessionUser } from '@/utils/session';
import { deletePost, editPost, getPostAuthorId } from '@/service/posts';

type Context = {
  params: Promise<{ id: string }>;
};

async function assertPostOwner(postId: string, userId: string) {
  const authorId = (await getPostAuthorId(postId))?.authorId;

  if (!authorId) {
    return new Response('Not Found', { status: 404 });
  }
  if (authorId !== userId) {
    return new Response('Forbidden', { status: 403 });
  }
  return null;
}

export async function POST(req: NextRequest, context: Context) {
  return withSessionUser(async (user) => {
    const id = (await context.params).id;

    const ownerError = await assertPostOwner(id, user.id);
    if (ownerError) return ownerError;

    const form = await req.formData();

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

    revalidateTag(`tags/${user.username}`, 'max');
    revalidateTag(`posts/${user.username}`, 'max');
    revalidateTag('posts', 'max');

    return result;
  });
}

export async function DELETE(_: NextRequest, context: Context) {
  return withSessionUser(async (user) => {
    const id = (await context.params).id;
    if (!id) return new Response('Bad Request', { status: 400 });

    const ownerError = await assertPostOwner(id, user.id);
    if (ownerError) return ownerError;

    const result = await deletePost(id).then((data) => NextResponse.json(data));

    revalidateTag(`tags/${user.username}`, 'max');
    revalidateTag(`posts/${user.username}`, 'max');
    revalidateTag('posts', 'max');

    return result;
  });
}

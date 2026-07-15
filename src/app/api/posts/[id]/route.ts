import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from "next/server";
import { withSessionUser } from '@/utils/session';
import { deletePost, editPost, getPostAuthorId } from '@/service/posts';
import { withErrorHandler, HttpError } from '@/lib/api-handler';

type Context = {
  params: Promise<{ id: string }>;
};

async function assertPostOwner(postId: string, userId: string) {
  const authorId = (await getPostAuthorId(postId))?.authorId;

  if (!authorId) {
    throw new HttpError(404, '게시글을 찾을 수 없습니다.');
  }
  if (authorId !== userId) {
    throw new HttpError(403, '권한이 없습니다.');
  }
}

export const POST = withErrorHandler(async (req: NextRequest, context: Context) => {
  return withSessionUser(async (user) => {
    const id = (await context.params).id;

    await assertPostOwner(id, user.id);

    const form = await req.formData();

    const mainImage = form.get('mainImageUrl')?.toString();
    const title = form.get('title')?.toString();
    const description = form.get('description')?.toString();
    const tags = form.get('tags')?.toString();
    const content = form.get('content')?.toString();

    if (!title || !content) {
      throw new HttpError(400, '제목과 내용을 입력해주세요.');
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

    revalidateTag(`tags/${user.slug}`, { expire: 0 });
    revalidateTag(`posts/${user.slug}`, { expire: 0 });
    revalidateTag('posts', { expire: 0 });

    return result;
  });
});

export const DELETE = withErrorHandler(async (_: NextRequest, context: Context) => {
  return withSessionUser(async (user) => {
    const id = (await context.params).id;
    if (!id) throw new HttpError(400, '잘못된 요청입니다.');

    await assertPostOwner(id, user.id);

    const result = await deletePost(id).then((data) => NextResponse.json(data));

    revalidateTag(`tags/${user.slug}`, { expire: 0 });
    revalidateTag(`posts/${user.slug}`, { expire: 0 });
    revalidateTag('posts', { expire: 0 });

    return result;
  });
});
